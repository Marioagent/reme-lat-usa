"""
RAGSearch1 Configuration Management
Loads and validates environment variables from .env file
"""

from pydantic_settings import BaseSettings
from typing import List, Optional
import os


class Settings(BaseSettings):
    """Application settings with validation"""

    # ====================
    # CORE SETTINGS
    # ====================
    APP_NAME: str = "RAGSearch1"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    LOG_LEVEL: str = "INFO"

    # API Settings
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    API_WORKERS: int = 4
    API_RELOAD: bool = True

    # Security
    SECRET_KEY: str
    ALLOWED_HOSTS: str = "localhost,127.0.0.1"
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:3001"

    # ====================
    # DATABASES
    # ====================

    # PostgreSQL
    POSTGRES_HOST: str = "postgres"
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str = "ragsearch1"
    POSTGRES_USER: str = "ragsearch1"
    POSTGRES_PASSWORD: str

    # Redis
    REDIS_HOST: str = "redis"
    REDIS_PORT: int = 6379
    REDIS_PASSWORD: Optional[str] = None
    REDIS_DB: int = 0
    CACHE_TTL: int = 3600

    # ChromaDB
    CHROMA_HOST: str = "chromadb"
    CHROMA_PORT: int = 8001
    CHROMA_PERSIST_DIR: str = "/data/chromadb"

    # ====================
    # AI/ML SETTINGS
    # ====================

    # OpenAI
    OPENAI_API_KEY: str
    OPENAI_MODEL: str = "gpt-4"
    OPENAI_EMBEDDING_MODEL: str = "text-embedding-ada-002"
    OPENAI_MAX_TOKENS: int = 4000
    OPENAI_TEMPERATURE: float = 0.7

    # Langchain
    LANGCHAIN_TRACING_V2: bool = False
    LANGCHAIN_API_KEY: Optional[str] = None

    # ====================
    # BANKING APIs
    # ====================

    # Plaid
    PLAID_CLIENT_ID: Optional[str] = None
    PLAID_SECRET: Optional[str] = None
    PLAID_ENV: str = "sandbox"
    PLAID_COUNTRY_CODES: str = "US,MX,CA"
    PLAID_PRODUCTS: str = "auth,transactions,identity"

    # Belvo
    BELVO_SECRET_ID: Optional[str] = None
    BELVO_SECRET_PASSWORD: Optional[str] = None
    BELVO_ENV: str = "sandbox"
    BELVO_TIMEOUT: int = 30000

    # Yodlee
    YODLEE_CLIENT_ID: Optional[str] = None
    YODLEE_SECRET: Optional[str] = None
    YODLEE_ENV: str = "sandbox"

    # ====================
    # CRYPTO APIs
    # ====================

    # ccxt
    CCXT_ENABLE: bool = True
    CCXT_EXCHANGES: str = "binance,coinbase,kraken,bitso,mercadobitcoin"
    CCXT_TIMEOUT: int = 30000
    CCXT_RATELIMIT: bool = True

    # CoinGecko
    COINGECKO_API_KEY: Optional[str] = None
    COINGECKO_DEMO_MODE: bool = True

    # CoinMarketCap
    COINMARKETCAP_API_KEY: Optional[str] = None

    # Blockchain APIs
    INFURA_PROJECT_ID: Optional[str] = None
    INFURA_PROJECT_SECRET: Optional[str] = None
    ALCHEMY_API_KEY: Optional[str] = None
    WEB3_PROVIDER_URI: Optional[str] = None

    # ====================
    # FOREX APIs
    # ====================

    EXCHANGERATE_API_KEY: Optional[str] = None
    ALPHAVANTAGE_API_KEY: Optional[str] = None
    FIXER_API_KEY: Optional[str] = None
    OPENEXCHANGERATES_APP_ID: Optional[str] = None

    # ====================
    # SCRAPING
    # ====================

    BCV_SCRAPER_ENABLE: bool = True
    BCV_UPDATE_INTERVAL: int = 1800  # 30 minutes
    BCV_TIMEOUT: int = 30000

    MONITOR_DOLAR_ENABLE: bool = True
    MONITOR_DOLAR_URL: str = "https://monitordolarvenezuela.com"

    USER_AGENT: str = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"

    # ====================
    # SCHEDULER
    # ====================

    UPDATE_EXCHANGES_INTERVAL: int = 900      # 15 minutes
    UPDATE_BCV_INTERVAL: int = 1800           # 30 minutes
    UPDATE_BANKS_INTERVAL: int = 86400        # 24 hours
    UPDATE_DISCOVERY_INTERVAL: int = 604800   # 7 days

    SCHEDULER_ENABLE: bool = True
    SCHEDULER_TIMEZONE: str = "America/Caracas"
    MAX_CONCURRENT_TASKS: int = 5

    # ====================
    # MONITORING
    # ====================

    PROMETHEUS_ENABLE: bool = True
    PROMETHEUS_PORT: int = 9090
    PROMETHEUS_METRICS_PATH: str = "/metrics"

    GRAFANA_ENABLE: bool = True
    GRAFANA_PORT: int = 3000
    GRAFANA_ADMIN_USER: str = "admin"
    GRAFANA_ADMIN_PASSWORD: str = "admin"

    LOG_FORMAT: str = "json"
    LOG_FILE: str = "/var/log/ragsearch1/app.log"
    LOG_MAX_BYTES: int = 10485760  # 10MB
    LOG_BACKUP_COUNT: int = 5

    # ====================
    # RATE LIMITING
    # ====================

    RATE_LIMIT_ENABLE: bool = True
    RATE_LIMIT_PER_MINUTE: int = 60
    RATE_LIMIT_PER_HOUR: int = 1000
    RATE_LIMIT_PER_DAY: int = 10000

    # ====================
    # PERFORMANCE
    # ====================

    DB_POOL_SIZE: int = 20
    DB_MAX_OVERFLOW: int = 40
    DB_POOL_TIMEOUT: int = 30
    DB_POOL_RECYCLE: int = 3600

    HTTP_TIMEOUT: int = 30
    API_REQUEST_TIMEOUT: int = 60
    SCRAPER_TIMEOUT: int = 30

    CACHE_ENABLE: bool = True
    CACHE_DEFAULT_TTL: int = 3600
    CACHE_MAX_ENTRIES: int = 10000

    # ====================
    # DATA COLLECTION
    # ====================

    COUNTRIES_ENABLED: str = "US,CA,MX,GT,HN,SV,NI,CR,PA,VE,CO,EC,PE,BR,BO,PY,AR,UY,CL,CU,DO,HT"
    ENTITY_TYPES: str = "bank,exchange,fintech,casa_cambio,wallet,defi"
    INITIAL_DATA_LOAD: bool = True
    SKIP_EXISTING: bool = True

    # ====================
    # FEATURE FLAGS
    # ====================

    FEATURE_BCV_PANEL: bool = True
    FEATURE_REMITTANCE_COMPARISON: bool = True
    FEATURE_CRYPTO_TRACKING: bool = True
    FEATURE_BLOCKCHAIN_DATA: bool = True
    FEATURE_ML_PREDICTIONS: bool = False
    FEATURE_REALTIME_UPDATES: bool = True
    FEATURE_WEBHOOKS: bool = False

    # ====================
    # ADVANCED
    # ====================

    VECTOR_DIMENSION: int = 1536  # OpenAI ada-002
    VECTOR_METRIC: str = "cosine"
    CHUNK_SIZE: int = 500
    CHUNK_OVERLAP: int = 50

    DEFAULT_SEARCH_LIMIT: int = 10
    MAX_SEARCH_LIMIT: int = 100
    MIN_SIMILARITY_SCORE: float = 0.7

    RAG_RETRIEVAL_K: int = 5
    RAG_RERANK: bool = True
    RAG_CONTEXT_WINDOW: int = 4000

    # ====================
    # COMPUTED PROPERTIES
    # ====================

    @property
    def DATABASE_URL(self) -> str:
        """PostgreSQL connection URL"""
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    @property
    def REDIS_URL(self) -> str:
        """Redis connection URL"""
        if self.REDIS_PASSWORD:
            return f"redis://:{self.REDIS_PASSWORD}@{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"
        return f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"

    @property
    def CHROMA_URL(self) -> str:
        """ChromaDB connection URL"""
        return f"http://{self.CHROMA_HOST}:{self.CHROMA_PORT}"

    @property
    def CORS_ORIGINS_LIST(self) -> List[str]:
        """CORS origins as list"""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    @property
    def COUNTRIES_LIST(self) -> List[str]:
        """Enabled countries as list"""
        return [country.strip() for country in self.COUNTRIES_ENABLED.split(",")]

    @property
    def ENTITY_TYPES_LIST(self) -> List[str]:
        """Entity types as list"""
        return [entity.strip() for entity in self.ENTITY_TYPES.split(",")]

    @property
    def CCXT_EXCHANGES_LIST(self) -> List[str]:
        """CCXT exchanges as list"""
        return [exchange.strip() for exchange in self.CCXT_EXCHANGES.split(",")]

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"  # Ignore extra fields in .env


# Global settings instance
settings = Settings()


def get_settings() -> Settings:
    """Get application settings"""
    return settings
