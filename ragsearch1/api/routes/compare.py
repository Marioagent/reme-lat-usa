"""
Remittance comparison endpoints for RAGSearch1 API
"""

from fastapi import APIRouter, HTTPException
import logging

from ragsearch1.retriever import get_retriever
from ..models import (
    CompareRequest,
    CompareResponse,
    RemittanceOption
)

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/compare", response_model=CompareResponse)
async def compare_remittance_options(request: CompareRequest):
    """
    Compare remittance options between two countries

    Analyzes the best options to send money from one country to another,
    considering fees, speed, reliability, and user ratings.

    Example:
    ```json
    {
        "from_country": "US",
        "to_country": "VE",
        "amount": 100,
        "currency": "USD"
    }
    ```

    Returns:
    - List of available remittance services
    - AI-powered comparison and recommendation
    - Source citations
    """
    try:
        retriever = get_retriever()

        # Get comparison
        comparison = retriever.compare_remittance_options(
            from_country=request.from_country.upper(),
            to_country=request.to_country.upper(),
            amount=request.amount
        )

        # Format options
        formatted_options = [
            RemittanceOption(
                id=opt['id'],
                name=opt['metadata']['name'],
                type=opt['metadata']['type'],
                country=opt['metadata']['country'],
                similarity_score=opt['similarity_score'],
                metadata=opt['metadata']
            )
            for opt in comparison['options']
        ]

        return CompareResponse(
            from_country=request.from_country.upper(),
            to_country=request.to_country.upper(),
            amount=request.amount,
            currency=request.currency.upper(),
            options=formatted_options,
            comparison=comparison.get('comparison', comparison.get('recommendation', '')),
            sources=comparison.get('sources', []),
            total_found=comparison['total_found']
        )

    except Exception as e:
        logger.error(f"Comparison failed: {e}")
        raise HTTPException(status_code=500, detail=f"Comparison failed: {str(e)}")


@router.get("/compare/countries")
async def get_supported_countries():
    """
    Get list of supported countries for remittance comparison

    Returns ISO country codes and names for all supported countries.
    """
    try:
        from ragsearch1.config import settings

        # Map of country codes to names
        country_map = {
            # North America
            "US": "United States",
            "CA": "Canada",
            "MX": "Mexico",

            # Central America
            "GT": "Guatemala",
            "HN": "Honduras",
            "SV": "El Salvador",
            "NI": "Nicaragua",
            "CR": "Costa Rica",
            "PA": "Panama",

            # South America
            "VE": "Venezuela",
            "CO": "Colombia",
            "EC": "Ecuador",
            "PE": "Peru",
            "BR": "Brazil",
            "BO": "Bolivia",
            "PY": "Paraguay",
            "AR": "Argentina",
            "UY": "Uruguay",
            "CL": "Chile",

            # Caribbean
            "CU": "Cuba",
            "DO": "Dominican Republic",
            "HT": "Haiti",
        }

        # Filter by enabled countries
        enabled_countries = [
            {"code": code, "name": name}
            for code, name in country_map.items()
            if code in settings.COUNTRIES_LIST
        ]

        return {
            "countries": enabled_countries,
            "total": len(enabled_countries)
        }

    except Exception as e:
        logger.error(f"Get countries failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/compare/services")
async def get_remittance_services():
    """
    Get list of all remittance services in the database

    Returns all known remittance and money transfer services.
    """
    try:
        retriever = get_retriever()

        # Search for remittance services
        services = retriever.search(
            query="remittance money transfer services",
            limit=50,
            filters={"type": "fintech"}
        )

        return {
            "services": [
                {
                    "id": s['id'],
                    "name": s['metadata']['name'],
                    "country": s['metadata']['country'],
                    "url": s['metadata'].get('url', ''),
                    "api_available": s['metadata'].get('api_available', False)
                }
                for s in services
            ],
            "total": len(services)
        }

    except Exception as e:
        logger.error(f"Get services failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
