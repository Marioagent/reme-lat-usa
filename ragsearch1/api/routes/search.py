"""
Search endpoints for RAGSearch1 API
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional
import logging

from ragsearch1.retriever import get_retriever
from ..models import (
    SearchRequest,
    SearchResponse,
    SearchResult,
    EntityMetadata,
    AskRequest,
    AskResponse,
    EntityByIdResponse,
    EntityListResponse
)

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/search", response_model=SearchResponse)
async def search_entities(request: SearchRequest):
    """
    Search for financial institutions using vector similarity

    **Query**: Natural language search query
    **Limit**: Number of results (1-100)
    **Filters**: Optional filters for country and type

    Example:
    ```json
    {
        "query": "mejores exchanges en México",
        "limit": 10,
        "filters": {
            "country": "MX",
            "type": "exchange"
        }
    }
    ```
    """
    try:
        retriever = get_retriever()

        # Perform search
        results = retriever.search(
            query=request.query,
            limit=request.limit,
            filters=request.filters
        )

        # Format results
        formatted_results = [
            SearchResult(
                id=r['id'],
                document=r['document'],
                metadata=EntityMetadata(**r['metadata']),
                similarity_score=r['similarity_score']
            )
            for r in results
        ]

        return SearchResponse(
            results=formatted_results,
            total=len(formatted_results),
            query=request.query,
            filters=request.filters
        )

    except Exception as e:
        logger.error(f"Search failed: {e}")
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")


@router.post("/ask", response_model=AskResponse)
async def ask_question(request: AskRequest):
    """
    Ask a natural language question and get an AI-powered answer

    Uses RAG (Retrieval-Augmented Generation) to provide accurate answers
    with source citations.

    Example:
    ```json
    {
        "question": "¿Cuáles son las mejores opciones para enviar dinero a Venezuela?",
        "context_limit": 5
    }
    ```
    """
    try:
        retriever = get_retriever()

        # Get answer
        response = retriever.ask(
            question=request.question,
            context_limit=request.context_limit
        )

        return AskResponse(
            question=request.question,
            answer=response['answer'],
            sources=response['sources'],
            confidence=response['confidence']
        )

    except Exception as e:
        logger.error(f"Ask failed: {e}")
        raise HTTPException(status_code=500, detail=f"Question answering failed: {str(e)}")


@router.get("/entity/{entity_id}", response_model=EntityByIdResponse)
async def get_entity_by_id(entity_id: str):
    """
    Get a specific financial entity by its ID

    Returns complete entity information including document text and metadata.
    """
    try:
        retriever = get_retriever()

        entity = retriever.get_entity_by_id(entity_id)

        if not entity:
            raise HTTPException(status_code=404, detail=f"Entity {entity_id} not found")

        return EntityByIdResponse(
            id=entity['id'],
            document=entity['document'],
            metadata=EntityMetadata(**entity['metadata'])
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get entity failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/entities/country/{country_code}", response_model=EntityListResponse)
async def get_entities_by_country(
    country_code: str,
    limit: int = Query(20, ge=1, le=100)
):
    """
    Get all financial entities for a specific country

    **country_code**: ISO country code (e.g., 'VE', 'US', 'MX')
    **limit**: Maximum number of results
    """
    try:
        retriever = get_retriever()

        entities = retriever.get_entities_by_country(
            country_code=country_code.upper(),
            limit=limit
        )

        formatted_results = [
            SearchResult(
                id=e['id'],
                document=e['document'],
                metadata=EntityMetadata(**e['metadata']),
                similarity_score=e['similarity_score']
            )
            for e in entities
        ]

        return EntityListResponse(
            entities=formatted_results,
            total=len(formatted_results),
            country=country_code.upper()
        )

    except Exception as e:
        logger.error(f"Get entities by country failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/entities/type/{entity_type}", response_model=EntityListResponse)
async def get_entities_by_type(
    entity_type: str,
    limit: int = Query(20, ge=1, le=100)
):
    """
    Get all entities of a specific type

    **entity_type**: Type of entity (bank, exchange, fintech, casa_cambio, wallet, defi)
    **limit**: Maximum number of results
    """
    try:
        retriever = get_retriever()

        entities = retriever.get_entities_by_type(
            entity_type=entity_type.lower(),
            limit=limit
        )

        formatted_results = [
            SearchResult(
                id=e['id'],
                document=e['document'],
                metadata=EntityMetadata(**e['metadata']),
                similarity_score=e['similarity_score']
            )
            for e in entities
        ]

        return EntityListResponse(
            entities=formatted_results,
            total=len(formatted_results),
            type=entity_type.lower()
        )

    except Exception as e:
        logger.error(f"Get entities by type failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/similar/{entity_id}", response_model=EntityListResponse)
async def get_similar_entities(
    entity_id: str,
    limit: int = Query(5, ge=1, le=20)
):
    """
    Find similar entities to a given entity

    Useful for recommendations and related entities discovery.
    """
    try:
        retriever = get_retriever()

        similar = retriever.suggest_similar(
            entity_id=entity_id,
            limit=limit
        )

        formatted_results = [
            SearchResult(
                id=e['id'],
                document=e['document'],
                metadata=EntityMetadata(**e['metadata']),
                similarity_score=e['similarity_score']
            )
            for e in similar
        ]

        return EntityListResponse(
            entities=formatted_results,
            total=len(formatted_results)
        )

    except Exception as e:
        logger.error(f"Get similar entities failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
