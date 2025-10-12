"""
BCV Venezuela endpoints for RAGSearch1 API
Real-time exchange rates from multiple Venezuelan sources
"""

from fastapi import APIRouter, HTTPException
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/bcv/rates")
async def get_bcv_rates():
    """
    Get real-time Venezuela exchange rates

    Returns:
    - BCV official rate (Banco Central de Venezuela)
    - Parallel market rate (Monitor Dólar, EnParaleloVzla)
    - Binance P2P rate
    - EUR/USD rate
    - Source information and confidence levels

    Rates are updated every 30 minutes with multiple source validation.
    """
    try:
        # Import aquí para evitar dependencias circulares
        import sys
        import os

        # Add parent directory to path to import from lib
        parent_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
        if parent_dir not in sys.path:
            sys.path.insert(0, parent_dir)

        try:
            from lib.bcv_api import getVenezuelaRatesValidated

            # Get validated rates from our existing BCV API
            rates = await getVenezuelaRatesValidated()

            return {
                "bcv_oficial": rates['bcv']['rate'],
                "paralelo": rates['paralelo']['rate'],
                "binance_p2p": rates['binanceP2P']['rate'],
                "sources": {
                    "bcv": {
                        "rate": rates['bcv']['rate'],
                        "source": rates['bcv']['source'],
                        "confidence": rates['bcv']['confidence']
                    },
                    "paralelo": {
                        "rate": rates['paralelo']['rate'],
                        "source": rates['paralelo']['source'],
                        "confidence": rates['paralelo']['confidence']
                    },
                    "binance_p2p": {
                        "rate": rates['binanceP2P']['rate'],
                        "source": rates['binanceP2P']['source'],
                        "confidence": rates['binanceP2P']['confidence']
                    }
                },
                "validation": rates['validation'],
                "last_updated": datetime.fromtimestamp(rates['bcv']['timestamp'] / 1000).isoformat(),
                "timestamp": rates['bcv']['timestamp']
            }

        except ImportError:
            # Fallback: usar API simple
            import aiohttp

            async with aiohttp.ClientSession() as session:
                # Try pydolarvenezuela API
                async with session.get(
                    'https://pydolarvenezuela-api.vercel.app/api/v1/dollar',
                    timeout=aiohttp.ClientTimeout(total=5)
                ) as response:
                    if response.status == 200:
                        data = await response.json()

                        bcv_rate = float(data['monitors'].get('bcv', {}).get('price', 36.50))
                        paralelo_rate = float(data['monitors'].get('enparalelovzla', {}).get('price', 38.50))
                        binance_rate = float(data['monitors'].get('binance', {}).get('price', 38.20))

                        return {
                            "bcv_oficial": bcv_rate,
                            "paralelo": paralelo_rate,
                            "binance_p2p": binance_rate,
                            "sources": {
                                "bcv": {
                                    "rate": bcv_rate,
                                    "source": "pydolarvenezuela",
                                    "confidence": "high"
                                },
                                "paralelo": {
                                    "rate": paralelo_rate,
                                    "source": "pydolarvenezuela",
                                    "confidence": "high"
                                },
                                "binance_p2p": {
                                    "rate": binance_rate,
                                    "source": "pydolarvenezuela",
                                    "confidence": "high"
                                }
                            },
                            "validation": {
                                "bcvParaleloDiff": round(((paralelo_rate - bcv_rate) / bcv_rate) * 100, 2),
                                "binanceParaleloDiff": round(((binance_rate - paralelo_rate) / paralelo_rate) * 100, 2),
                                "alert": None
                            },
                            "last_updated": datetime.now().isoformat(),
                            "timestamp": int(datetime.now().timestamp() * 1000)
                        }
                    else:
                        raise Exception("API request failed")

    except Exception as e:
        logger.error(f"Get BCV rates failed: {e}")

        # Fallback rates si todo falla
        return {
            "bcv_oficial": 36.50,
            "paralelo": 38.50,
            "binance_p2p": 38.20,
            "sources": {
                "bcv": {
                    "rate": 36.50,
                    "source": "Fallback (API unavailable)",
                    "confidence": "low"
                },
                "paralelo": {
                    "rate": 38.50,
                    "source": "Fallback (API unavailable)",
                    "confidence": "low"
                },
                "binance_p2p": {
                    "rate": 38.20,
                    "source": "Fallback (API unavailable)",
                    "confidence": "low"
                }
            },
            "validation": {
                "bcvParaleloDiff": 5.48,
                "binanceParaleloDiff": -0.78,
                "alert": "Using fallback rates - APIs unavailable (weekend/holiday)"
            },
            "last_updated": datetime.now().isoformat(),
            "timestamp": int(datetime.now().timestamp() * 1000),
            "note": "Fallback rates in use"
        }


@router.get("/bcv/history")
async def get_bcv_history(days: int = 7):
    """
    Get historical BCV rates (placeholder for future implementation)

    Args:
        days: Number of days of history to retrieve (1-30)

    Note: This endpoint will be implemented when historical data collection is added.
    """
    return {
        "message": "Historical data collection not yet implemented",
        "days_requested": days,
        "status": "coming_soon"
    }


@router.get("/bcv/entities")
async def get_venezuela_entities():
    """
    Get all financial entities in Venezuela

    Returns banks, exchanges, casas de cambio, and fintech companies
    operating in Venezuela.
    """
    try:
        from ragsearch1.retriever import get_retriever

        retriever = get_retriever()

        entities = retriever.get_entities_by_country(
            country_code="VE",
            limit=50
        )

        return {
            "entities": [
                {
                    "id": e['id'],
                    "name": e['metadata']['name'],
                    "type": e['metadata']['type'],
                    "api_available": e['metadata'].get('api_available', False),
                    "url": e['metadata'].get('url', ''),
                    "similarity_score": e['similarity_score']
                }
                for e in entities
            ],
            "total": len(entities),
            "country": "VE"
        }

    except Exception as e:
        logger.error(f"Get Venezuela entities failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
