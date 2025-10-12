"""
ChromaDB Vector Database Integration
Handles vector storage, retrieval, and similarity search
"""

import chromadb
from chromadb.config import Settings as ChromaSettings
from typing import List, Dict, Any, Optional
import logging
from .config import settings

logger = logging.getLogger(__name__)


class VectorDatabase:
    """
    ChromaDB wrapper for RAGSearch1
    Manages vector embeddings and similarity search for financial entities
    """

    def __init__(self):
        """Initialize ChromaDB client and collection"""
        self.client = None
        self.collection = None
        self._initialize_client()

    def _initialize_client(self):
        """Initialize ChromaDB client with configuration"""
        try:
            if settings.ENVIRONMENT == "production":
                # Production: Connect to remote ChromaDB
                self.client = chromadb.HttpClient(
                    host=settings.CHROMA_HOST,
                    port=settings.CHROMA_PORT,
                    settings=ChromaSettings(
                        anonymized_telemetry=False,
                    )
                )
            else:
                # Development: Use persistent local storage
                self.client = chromadb.PersistentClient(
                    path=settings.CHROMA_PERSIST_DIR,
                    settings=ChromaSettings(
                        anonymized_telemetry=False,
                    )
                )

            # Get or create collection
            self.collection = self.client.get_or_create_collection(
                name="financial_entities",
                metadata={
                    "description": "Financial institutions across America",
                    "dimension": settings.VECTOR_DIMENSION,
                    "metric": settings.VECTOR_METRIC,
                }
            )

            logger.info(f"ChromaDB initialized successfully. Collection: {self.collection.name}")

        except Exception as e:
            logger.error(f"Failed to initialize ChromaDB: {e}")
            raise

    def add_documents(
        self,
        documents: List[str],
        metadatas: List[Dict[str, Any]],
        ids: List[str],
        embeddings: Optional[List[List[float]]] = None
    ) -> bool:
        """
        Add documents to the vector database

        Args:
            documents: List of text documents
            metadatas: List of metadata dicts for each document
            ids: List of unique IDs for each document
            embeddings: Optional pre-computed embeddings

        Returns:
            bool: Success status
        """
        try:
            if embeddings:
                self.collection.add(
                    documents=documents,
                    metadatas=metadatas,
                    ids=ids,
                    embeddings=embeddings
                )
            else:
                # ChromaDB will compute embeddings automatically
                self.collection.add(
                    documents=documents,
                    metadatas=metadatas,
                    ids=ids
                )

            logger.info(f"Added {len(documents)} documents to ChromaDB")
            return True

        except Exception as e:
            logger.error(f"Failed to add documents: {e}")
            return False

    def query(
        self,
        query_texts: List[str],
        n_results: int = 10,
        where: Optional[Dict[str, Any]] = None,
        where_document: Optional[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        """
        Query the vector database for similar documents

        Args:
            query_texts: List of query strings
            n_results: Number of results to return
            where: Metadata filter conditions
            where_document: Document content filter conditions

        Returns:
            Dict with ids, documents, metadatas, distances
        """
        try:
            results = self.collection.query(
                query_texts=query_texts,
                n_results=n_results,
                where=where,
                where_document=where_document
            )

            logger.info(f"Query returned {len(results['ids'][0])} results")
            return results

        except Exception as e:
            logger.error(f"Query failed: {e}")
            return {"ids": [[]], "documents": [[]], "metadatas": [[]], "distances": [[]]}

    def search_by_country(
        self,
        query_text: str,
        country_code: str,
        n_results: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Search for entities in a specific country

        Args:
            query_text: Search query
            country_code: ISO country code (e.g., 'VE', 'US')
            n_results: Number of results

        Returns:
            List of matching entities with metadata
        """
        try:
            results = self.collection.query(
                query_texts=[query_text],
                n_results=n_results,
                where={"country": country_code}
            )

            # Format results
            formatted_results = []
            for i in range(len(results['ids'][0])):
                formatted_results.append({
                    "id": results['ids'][0][i],
                    "document": results['documents'][0][i],
                    "metadata": results['metadatas'][0][i],
                    "similarity": 1 - results['distances'][0][i]  # Convert distance to similarity
                })

            return formatted_results

        except Exception as e:
            logger.error(f"Country search failed: {e}")
            return []

    def search_by_type(
        self,
        query_text: str,
        entity_type: str,
        n_results: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Search for entities of a specific type

        Args:
            query_text: Search query
            entity_type: Type of entity (e.g., 'bank', 'exchange', 'fintech')
            n_results: Number of results

        Returns:
            List of matching entities
        """
        try:
            results = self.collection.query(
                query_texts=[query_text],
                n_results=n_results,
                where={"type": entity_type}
            )

            formatted_results = []
            for i in range(len(results['ids'][0])):
                formatted_results.append({
                    "id": results['ids'][0][i],
                    "document": results['documents'][0][i],
                    "metadata": results['metadatas'][0][i],
                    "similarity": 1 - results['distances'][0][i]
                })

            return formatted_results

        except Exception as e:
            logger.error(f"Type search failed: {e}")
            return []

    def update_document(
        self,
        document_id: str,
        document: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
        embedding: Optional[List[float]] = None
    ) -> bool:
        """
        Update a document in the database

        Args:
            document_id: ID of document to update
            document: New document text
            metadata: New metadata
            embedding: New embedding

        Returns:
            bool: Success status
        """
        try:
            update_data = {"ids": [document_id]}

            if document:
                update_data["documents"] = [document]
            if metadata:
                update_data["metadatas"] = [metadata]
            if embedding:
                update_data["embeddings"] = [embedding]

            self.collection.update(**update_data)
            logger.info(f"Updated document {document_id}")
            return True

        except Exception as e:
            logger.error(f"Update failed: {e}")
            return False

    def delete_documents(self, ids: List[str]) -> bool:
        """
        Delete documents from the database

        Args:
            ids: List of document IDs to delete

        Returns:
            bool: Success status
        """
        try:
            self.collection.delete(ids=ids)
            logger.info(f"Deleted {len(ids)} documents")
            return True

        except Exception as e:
            logger.error(f"Delete failed: {e}")
            return False

    def get_collection_stats(self) -> Dict[str, Any]:
        """
        Get statistics about the collection

        Returns:
            Dict with collection statistics
        """
        try:
            count = self.collection.count()
            return {
                "name": self.collection.name,
                "count": count,
                "metadata": self.collection.metadata
            }

        except Exception as e:
            logger.error(f"Failed to get stats: {e}")
            return {}

    def reset_collection(self) -> bool:
        """
        Delete all documents from the collection (use with caution!)

        Returns:
            bool: Success status
        """
        try:
            self.client.delete_collection(name=self.collection.name)
            self._initialize_client()
            logger.warning("Collection has been reset!")
            return True

        except Exception as e:
            logger.error(f"Reset failed: {e}")
            return False


# Global vector database instance
vector_db = VectorDatabase()


def get_vector_db() -> VectorDatabase:
    """Get global vector database instance"""
    return vector_db
