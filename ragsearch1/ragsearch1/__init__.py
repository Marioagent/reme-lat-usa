"""
RAGSearch1 - Sistema RAG para Instituciones Financieras de América

Sistema de búsqueda inteligente basado en RAG (Retrieval-Augmented Generation)
que indexa y proporciona información actualizada sobre instituciones financieras
en 32+ países de América.
"""

__version__ = "1.0.0"
__author__ = "MGA"

from .config import settings, get_settings

__all__ = ["settings", "get_settings", "__version__"]
