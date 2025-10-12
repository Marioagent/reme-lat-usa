"""
RAG Retriever for RAGSearch1
Implements Retrieval-Augmented Generation for intelligent search
Uses Langchain + ChromaDB + OpenAI
"""

import logging
from typing import List, Dict, Any, Optional
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import Chroma

from .config import settings
from .vectordb import get_vector_db

logger = logging.getLogger(__name__)


class RAGRetriever:
    """
    RAG-based intelligent retrieval system
    Combines vector search with LLM-powered question answering
    """

    def __init__(self):
        """Initialize RAG retriever"""
        self.vector_db = get_vector_db()
        self.embeddings = OpenAIEmbeddings(
            model=settings.OPENAI_EMBEDDING_MODEL,
            openai_api_key=settings.OPENAI_API_KEY
        )
        self.llm = ChatOpenAI(
            model=settings.OPENAI_MODEL,
            temperature=settings.OPENAI_TEMPERATURE,
            max_tokens=settings.OPENAI_MAX_TOKENS,
            openai_api_key=settings.OPENAI_API_KEY
        )
        self.qa_chain = None
        self._initialize_qa_chain()

    def _initialize_qa_chain(self):
        """Initialize the QA chain with custom prompt"""

        # Custom prompt for financial institution search
        prompt_template = """You are an expert assistant for financial institutions in the Americas.
Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say that you don't know, don't try to make up an answer.
Always provide specific institution names, countries, and relevant details.

Context: {context}

Question: {question}

Answer in a clear, professional manner with specific details:"""

        PROMPT = PromptTemplate(
            template=prompt_template,
            input_variables=["context", "question"]
        )

        # Note: We'll create a simple retriever for now
        # In production, this would integrate directly with ChromaDB via Langchain
        logger.info("RAG retriever initialized")

    def search(
        self,
        query: str,
        limit: int = 10,
        filters: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """
        Search for financial entities using vector similarity

        Args:
            query: Search query
            limit: Number of results
            filters: Optional metadata filters (country, type, etc.)

        Returns:
            List of matching entities
        """
        try:
            # Build where clause from filters
            where = {}
            if filters:
                if filters.get("country"):
                    where["country"] = filters["country"]
                if filters.get("type"):
                    where["type"] = filters["type"]

            # Query vector database
            results = self.vector_db.query(
                query_texts=[query],
                n_results=limit,
                where=where if where else None
            )

            # Format results
            formatted_results = []
            for i in range(len(results['ids'][0])):
                similarity = 1 - results['distances'][0][i]

                # Only return results above minimum similarity threshold
                if similarity >= settings.MIN_SIMILARITY_SCORE:
                    formatted_results.append({
                        "id": results['ids'][0][i],
                        "document": results['documents'][0][i],
                        "metadata": results['metadatas'][0][i],
                        "similarity_score": round(similarity, 3)
                    })

            logger.info(f"Search for '{query}' returned {len(formatted_results)} results")
            return formatted_results

        except Exception as e:
            logger.error(f"Search failed: {e}")
            return []

    def ask(self, question: str, context_limit: int = 5) -> Dict[str, Any]:
        """
        Ask a question and get an LLM-powered answer with sources

        Args:
            question: Natural language question
            context_limit: Number of context documents to retrieve

        Returns:
            Dict with answer and sources
        """
        try:
            # 1. Retrieve relevant context
            context_docs = self.search(question, limit=context_limit)

            if not context_docs:
                return {
                    "answer": "I couldn't find relevant information to answer your question.",
                    "sources": [],
                    "confidence": 0.0
                }

            # 2. Build context for LLM
            context_text = "\n\n".join([
                f"Source {i+1}:\n{doc['document']}"
                for i, doc in enumerate(context_docs)
            ])

            # 3. Create prompt
            prompt = f"""You are an expert assistant for financial institutions in the Americas.
Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say that you don't know, don't try to make up an answer.
Always provide specific institution names, countries, and relevant details.

Context:
{context_text}

Question: {question}

Answer in a clear, professional manner with specific details:"""

            # 4. Get LLM response
            response = self.llm.invoke(prompt)
            answer = response.content

            # 5. Calculate confidence based on similarity scores
            avg_similarity = sum(doc['similarity_score'] for doc in context_docs) / len(context_docs)

            return {
                "answer": answer,
                "sources": [
                    {
                        "name": doc['metadata'].get('name', 'Unknown'),
                        "type": doc['metadata'].get('type', 'unknown'),
                        "country": doc['metadata'].get('country', ''),
                        "similarity": doc['similarity_score']
                    }
                    for doc in context_docs
                ],
                "confidence": round(avg_similarity, 3)
            }

        except Exception as e:
            logger.error(f"Ask failed: {e}")
            return {
                "answer": f"Error processing question: {str(e)}",
                "sources": [],
                "confidence": 0.0
            }

    def compare_remittance_options(
        self,
        from_country: str,
        to_country: str,
        amount: float
    ) -> Dict[str, Any]:
        """
        Compare remittance options between two countries

        Args:
            from_country: Source country code
            to_country: Destination country code
            amount: Amount to send

        Returns:
            Dict with comparison and recommendations
        """
        try:
            # Build query
            query = f"remittance services from {from_country} to {to_country}"

            # Search for relevant services
            services = self.search(
                query=query,
                limit=10,
                filters={"type": "fintech"}
            )

            if not services:
                return {
                    "options": [],
                    "recommendation": f"No remittance services found for {from_country} to {to_country}",
                    "total_found": 0
                }

            # Ask LLM for comparison
            question = f"""Compare the best remittance options to send ${amount} from {from_country} to {to_country}.
Consider fees, speed, reliability, and user ratings. Provide a clear recommendation."""

            comparison = self.ask(question, context_limit=5)

            return {
                "options": services[:5],  # Top 5 options
                "comparison": comparison['answer'],
                "sources": comparison['sources'],
                "total_found": len(services)
            }

        except Exception as e:
            logger.error(f"Remittance comparison failed: {e}")
            return {
                "options": [],
                "recommendation": f"Error comparing options: {str(e)}",
                "total_found": 0
            }

    def get_entity_by_id(self, entity_id: str) -> Optional[Dict[str, Any]]:
        """
        Get a specific entity by ID

        Args:
            entity_id: Entity ID

        Returns:
            Entity dict or None
        """
        try:
            # ChromaDB get by ID
            result = self.vector_db.collection.get(
                ids=[entity_id],
                include=["documents", "metadatas"]
            )

            if result['ids']:
                return {
                    "id": result['ids'][0],
                    "document": result['documents'][0],
                    "metadata": result['metadatas'][0]
                }

            return None

        except Exception as e:
            logger.error(f"Get entity failed: {e}")
            return None

    def get_entities_by_country(
        self,
        country_code: str,
        limit: int = 20
    ) -> List[Dict[str, Any]]:
        """
        Get all entities for a specific country

        Args:
            country_code: ISO country code
            limit: Maximum results

        Returns:
            List of entities
        """
        try:
            # Query with country filter
            query = f"financial institutions in {country_code}"
            return self.search(query, limit=limit, filters={"country": country_code})

        except Exception as e:
            logger.error(f"Get entities by country failed: {e}")
            return []

    def get_entities_by_type(
        self,
        entity_type: str,
        limit: int = 20
    ) -> List[Dict[str, Any]]:
        """
        Get all entities of a specific type

        Args:
            entity_type: Type (bank, exchange, fintech, etc.)
            limit: Maximum results

        Returns:
            List of entities
        """
        try:
            query = f"{entity_type} institutions"
            return self.search(query, limit=limit, filters={"type": entity_type})

        except Exception as e:
            logger.error(f"Get entities by type failed: {e}")
            return []

    def suggest_similar(
        self,
        entity_id: str,
        limit: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Find similar entities to a given entity

        Args:
            entity_id: ID of reference entity
            limit: Number of similar entities

        Returns:
            List of similar entities
        """
        try:
            # Get reference entity
            entity = self.get_entity_by_id(entity_id)

            if not entity:
                return []

            # Search for similar entities
            query = entity['document']
            similar = self.search(query, limit=limit + 1)

            # Remove the reference entity itself
            similar = [e for e in similar if e['id'] != entity_id]

            return similar[:limit]

        except Exception as e:
            logger.error(f"Suggest similar failed: {e}")
            return []


# Global retriever instance
retriever = RAGRetriever()


def get_retriever() -> RAGRetriever:
    """Get global retriever instance"""
    return retriever
