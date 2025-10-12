"""
Pydantic models for RAGSearch1 API
Request and response validation
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional


# ====================
# SEARCH MODELS
# ====================

class SearchRequest(BaseModel):
    """Search request model"""
    query: str = Field(..., description="Search query", min_length=1, max_length=500)
    limit: int = Field(10, description="Number of results", ge=1, le=100)
    filters: Optional[Dict[str, str]] = Field(None, description="Optional filters (country, type)")


class EntityMetadata(BaseModel):
    """Entity metadata"""
    name: str
    type: str
    country: str
    api_available: bool
    url: Optional[str] = None


class SearchResult(BaseModel):
    """Single search result"""
    id: str
    document: str
    metadata: EntityMetadata
    similarity_score: float


class SearchResponse(BaseModel):
    """Search response model"""
    results: List[SearchResult]
    total: int
    query: str
    filters: Optional[Dict[str, str]] = None


# ====================
# COMPARISON MODELS
# ====================

class CompareRequest(BaseModel):
    """Remittance comparison request"""
    from_country: str = Field(..., description="Source country code (e.g., 'US')", min_length=2, max_length=2)
    to_country: str = Field(..., description="Destination country code (e.g., 'VE')", min_length=2, max_length=2)
    amount: float = Field(..., description="Amount to send", gt=0)
    currency: str = Field("USD", description="Currency code", min_length=3, max_length=3)


class RemittanceOption(BaseModel):
    """Single remittance option"""
    id: str
    name: str
    type: str
    country: str
    similarity_score: float
    metadata: Dict[str, Any]


class CompareResponse(BaseModel):
    """Comparison response model"""
    from_country: str
    to_country: str
    amount: float
    currency: str
    options: List[RemittanceOption]
    comparison: str
    sources: List[Dict[str, Any]]
    total_found: int


# ====================
# BCV VENEZUELA MODELS
# ====================

class BCVRatesResponse(BaseModel):
    """BCV Venezuela rates response"""
    bcv_oficial: float = Field(..., description="BCV official rate")
    paralelo: float = Field(..., description="Parallel market rate")
    binance_p2p: float = Field(..., description="Binance P2P rate")
    euro: Optional[float] = Field(None, description="EUR/USD rate")
    source: str = Field(..., description="Data source")
    last_updated: str = Field(..., description="Last update timestamp")
    confidence: str = Field(..., description="Data confidence level")


# ====================
# QUESTION ANSWERING MODEL
# ====================

class AskRequest(BaseModel):
    """Question answering request"""
    question: str = Field(..., description="Natural language question", min_length=1, max_length=500)
    context_limit: int = Field(5, description="Number of context documents", ge=1, le=10)


class AskResponse(BaseModel):
    """Question answering response"""
    question: str
    answer: str
    sources: List[Dict[str, Any]]
    confidence: float


# ====================
# ADMIN MODELS
# ====================

class CollectionStatsResponse(BaseModel):
    """Vector database collection stats"""
    name: str
    count: int
    metadata: Dict[str, Any]


class SchedulerStatusResponse(BaseModel):
    """Scheduler status"""
    is_running: bool
    timezone: str
    jobs: List[Dict[str, Any]]


class DataCollectionStatusResponse(BaseModel):
    """Data collection status"""
    total_entities: int
    sources: Dict[str, str]
    last_collection: str


# ====================
# ENTITY MODELS
# ====================

class EntityByIdResponse(BaseModel):
    """Entity by ID response"""
    id: str
    document: str
    metadata: EntityMetadata


class EntityListResponse(BaseModel):
    """List of entities response"""
    entities: List[SearchResult]
    total: int
    country: Optional[str] = None
    type: Optional[str] = None


# ====================
# ERROR MODELS
# ====================

class ErrorResponse(BaseModel):
    """Error response model"""
    error: str
    detail: Optional[str] = None
    status_code: int
