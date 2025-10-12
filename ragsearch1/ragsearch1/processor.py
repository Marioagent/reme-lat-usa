"""
Data Processor for RAGSearch1
Handles data cleaning, normalization, chunking, and embedding generation
"""

import re
import hashlib
from typing import List, Dict, Any, Optional
from langchain.text_splitter import RecursiveCharacterTextSplitter
from openai import OpenAI
import logging

from .config import settings

logger = logging.getLogger(__name__)


class DataProcessor:
    """
    Processes raw financial entity data for vector storage
    Cleans, normalizes, chunks, and generates embeddings
    """

    def __init__(self):
        """Initialize processor with OpenAI client"""
        self.openai_client = OpenAI(api_key=settings.OPENAI_API_KEY)
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.CHUNK_SIZE,
            chunk_overlap=settings.CHUNK_OVERLAP,
            length_function=len,
            separators=["\n\n", "\n", ". ", " ", ""]
        )

    def clean_text(self, text: str) -> str:
        """
        Clean and normalize text

        Args:
            text: Raw text to clean

        Returns:
            Cleaned text
        """
        if not text:
            return ""

        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)

        # Remove special characters (keep basic punctuation)
        text = re.sub(r'[^\w\s.,;:!?()-]', '', text)

        # Normalize whitespace around punctuation
        text = re.sub(r'\s+([.,;:!?])', r'\1', text)
        text = re.sub(r'([.,;:!?])([^\s])', r'\1 \2', text)

        return text.strip()

    def normalize_entity_data(self, entity: Dict[str, Any]) -> Dict[str, Any]:
        """
        Normalize entity data structure

        Args:
            entity: Raw entity data

        Returns:
            Normalized entity dict
        """
        normalized = {
            "id": entity.get("id", self._generate_id(entity)),
            "name": self.clean_text(entity.get("name", "")),
            "type": entity.get("type", "unknown").lower(),
            "country": entity.get("country", "").upper(),
            "description": self.clean_text(entity.get("description", "")),
            "services": entity.get("services", []),
            "api_available": entity.get("api_available", False),
            "url": entity.get("url", ""),
            "fees": entity.get("fees", {}),
            "supported_currencies": entity.get("supported_currencies", []),
            "rating": entity.get("rating", 0.0),
            "last_updated": entity.get("last_updated", ""),
        }

        return normalized

    def _generate_id(self, entity: Dict[str, Any]) -> str:
        """
        Generate unique ID for entity

        Args:
            entity: Entity data

        Returns:
            Unique hash ID
        """
        unique_str = f"{entity.get('name', '')}_{entity.get('country', '')}_{entity.get('type', '')}"
        return hashlib.md5(unique_str.encode()).hexdigest()

    def create_document_text(self, entity: Dict[str, Any]) -> str:
        """
        Create searchable document text from entity

        Args:
            entity: Normalized entity data

        Returns:
            Formatted document text
        """
        parts = [
            f"Name: {entity['name']}",
            f"Type: {entity['type']}",
            f"Country: {entity['country']}",
        ]

        if entity.get('description'):
            parts.append(f"Description: {entity['description']}")

        if entity.get('services'):
            services_str = ", ".join(entity['services'])
            parts.append(f"Services: {services_str}")

        if entity.get('supported_currencies'):
            currencies_str = ", ".join(entity['supported_currencies'])
            parts.append(f"Supported Currencies: {currencies_str}")

        if entity.get('api_available'):
            parts.append("API: Available")

        if entity.get('url'):
            parts.append(f"Website: {entity['url']}")

        return "\n".join(parts)

    def chunk_document(self, text: str) -> List[str]:
        """
        Split long document into chunks

        Args:
            text: Document text

        Returns:
            List of text chunks
        """
        if len(text) <= settings.CHUNK_SIZE:
            return [text]

        chunks = self.text_splitter.split_text(text)
        logger.info(f"Split document into {len(chunks)} chunks")
        return chunks

    def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """
        Generate embeddings for texts using OpenAI

        Args:
            texts: List of texts to embed

        Returns:
            List of embedding vectors
        """
        try:
            # OpenAI has a limit of 2048 texts per request
            batch_size = 2048
            all_embeddings = []

            for i in range(0, len(texts), batch_size):
                batch = texts[i:i + batch_size]

                response = self.openai_client.embeddings.create(
                    model=settings.OPENAI_EMBEDDING_MODEL,
                    input=batch
                )

                batch_embeddings = [item.embedding for item in response.data]
                all_embeddings.extend(batch_embeddings)

                logger.info(f"Generated embeddings for batch {i // batch_size + 1}")

            return all_embeddings

        except Exception as e:
            logger.error(f"Failed to generate embeddings: {e}")
            raise

    def process_entity_batch(
        self,
        entities: List[Dict[str, Any]]
    ) -> tuple[List[str], List[Dict[str, Any]], List[str], List[List[float]]]:
        """
        Process a batch of entities for vector storage

        Args:
            entities: List of raw entity dicts

        Returns:
            Tuple of (documents, metadatas, ids, embeddings)
        """
        documents = []
        metadatas = []
        ids = []

        for entity in entities:
            # Normalize entity
            normalized = self.normalize_entity_data(entity)

            # Create document text
            doc_text = self.create_document_text(normalized)

            # Store
            documents.append(doc_text)
            metadatas.append({
                "name": normalized["name"],
                "type": normalized["type"],
                "country": normalized["country"],
                "api_available": normalized["api_available"],
                "url": normalized["url"],
            })
            ids.append(normalized["id"])

        # Generate embeddings for all documents
        embeddings = self.generate_embeddings(documents)

        logger.info(f"Processed {len(entities)} entities")

        return documents, metadatas, ids, embeddings

    def extract_metadata(self, entity: Dict[str, Any]) -> Dict[str, Any]:
        """
        Extract relevant metadata from entity

        Args:
            entity: Entity data

        Returns:
            Metadata dict
        """
        return {
            "name": entity.get("name", ""),
            "type": entity.get("type", "unknown"),
            "country": entity.get("country", ""),
            "api_available": entity.get("api_available", False),
            "url": entity.get("url", ""),
            "rating": entity.get("rating", 0.0),
            "last_updated": entity.get("last_updated", ""),
        }

    def validate_entity(self, entity: Dict[str, Any]) -> bool:
        """
        Validate entity has required fields

        Args:
            entity: Entity data to validate

        Returns:
            bool: True if valid
        """
        required_fields = ["name", "type", "country"]

        for field in required_fields:
            if not entity.get(field):
                logger.warning(f"Entity missing required field: {field}")
                return False

        # Validate country code
        if entity.get("country") not in settings.COUNTRIES_LIST:
            logger.warning(f"Invalid country code: {entity.get('country')}")
            return False

        # Validate entity type
        if entity.get("type") not in settings.ENTITY_TYPES_LIST:
            logger.warning(f"Invalid entity type: {entity.get('type')}")
            return False

        return True

    def deduplicate_entities(
        self,
        entities: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Remove duplicate entities

        Args:
            entities: List of entities

        Returns:
            Deduplicated list
        """
        seen_ids = set()
        unique_entities = []

        for entity in entities:
            entity_id = self._generate_id(entity)

            if entity_id not in seen_ids:
                seen_ids.add(entity_id)
                unique_entities.append(entity)

        removed = len(entities) - len(unique_entities)
        if removed > 0:
            logger.info(f"Removed {removed} duplicate entities")

        return unique_entities


# Global processor instance
processor = DataProcessor()


def get_processor() -> DataProcessor:
    """Get global processor instance"""
    return processor
