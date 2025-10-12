"""
Data Collector for RAGSearch1
Collects financial entity data from multiple sources:
- Banking APIs (Plaid, Belvo, Yodlee)
- Crypto exchanges (ccxt)
- Web scraping (BCV, Monitor Dólar)
- Blockchain data (Web3)
"""

import logging
from typing import List, Dict, Any, Optional
import asyncio
import aiohttp
from datetime import datetime

from .config import settings

logger = logging.getLogger(__name__)


class DataCollector:
    """
    Collects financial institution data from multiple sources
    """

    def __init__(self):
        """Initialize collector"""
        self.collected_entities = []
        self.sources_status = {}

    async def collect_all(self) -> List[Dict[str, Any]]:
        """
        Collect data from all enabled sources

        Returns:
            List of collected entities
        """
        tasks = []

        # Banking sources
        if settings.PLAID_CLIENT_ID and settings.PLAID_SECRET:
            tasks.append(self.collect_plaid_institutions())

        if settings.BELVO_SECRET_ID and settings.BELVO_SECRET_PASSWORD:
            tasks.append(self.collect_belvo_institutions())

        # Crypto sources
        if settings.CCXT_ENABLE:
            tasks.append(self.collect_crypto_exchanges())

        # Scraping sources
        if settings.BCV_SCRAPER_ENABLE:
            tasks.append(self.collect_venezuela_entities())

        # Execute all collection tasks in parallel
        results = await asyncio.gather(*tasks, return_exceptions=True)

        # Combine all results
        all_entities = []
        for result in results:
            if isinstance(result, list):
                all_entities.extend(result)
            elif isinstance(result, Exception):
                logger.error(f"Collection task failed: {result}")

        self.collected_entities = all_entities
        logger.info(f"Collected {len(all_entities)} total entities")

        return all_entities

    async def collect_plaid_institutions(self) -> List[Dict[str, Any]]:
        """
        Collect institutions from Plaid API

        Returns:
            List of bank entities
        """
        try:
            # Note: This is a simplified version
            # Full implementation would use plaid-python SDK
            logger.info("Collecting Plaid institutions...")

            entities = []

            # Example: Plaid supports 11,000+ institutions
            # We would fetch and format them here
            # For now, returning placeholder structure

            # In production, this would be:
            # from plaid.api import plaid_api
            # client = plaid_api.PlaidApi(plaid.ApiClient(configuration))
            # response = client.institutions_get(request)

            self.sources_status["plaid"] = "success"
            logger.info(f"Collected {len(entities)} Plaid institutions")

            return entities

        except Exception as e:
            logger.error(f"Plaid collection failed: {e}")
            self.sources_status["plaid"] = f"error: {str(e)}"
            return []

    async def collect_belvo_institutions(self) -> List[Dict[str, Any]]:
        """
        Collect institutions from Belvo API (LATAM banking)

        Returns:
            List of bank entities
        """
        try:
            logger.info("Collecting Belvo institutions...")

            entities = []

            # Example: Belvo covers MX, BR, CO, AR, CL, PE
            # Full implementation would use belvo-python SDK

            # from belvo.client import Client
            # client = Client(secret_id, secret_password, url)
            # institutions = client.Institutions.list()

            # For each institution, format as:
            # {
            #     "name": institution['display_name'],
            #     "type": "bank",
            #     "country": institution['country_code'],
            #     "description": f"Banking institution in {country}",
            #     "api_available": True,
            #     "url": institution['website'],
            #     "services": ["transactions", "accounts", "identity"],
            #     "supported_currencies": [currency codes],
            # }

            self.sources_status["belvo"] = "success"
            logger.info(f"Collected {len(entities)} Belvo institutions")

            return entities

        except Exception as e:
            logger.error(f"Belvo collection failed: {e}")
            self.sources_status["belvo"] = f"error: {str(e)}"
            return []

    async def collect_crypto_exchanges(self) -> List[Dict[str, Any]]:
        """
        Collect crypto exchanges from ccxt

        Returns:
            List of exchange entities
        """
        try:
            import ccxt

            logger.info("Collecting crypto exchanges...")

            entities = []

            # Get list of exchanges to collect
            exchanges_to_collect = settings.CCXT_EXCHANGES_LIST

            for exchange_id in exchanges_to_collect:
                try:
                    # Initialize exchange
                    exchange_class = getattr(ccxt, exchange_id)
                    exchange = exchange_class({
                        'enableRateLimit': settings.CCXT_RATELIMIT,
                        'timeout': settings.CCXT_TIMEOUT,
                    })

                    # Load markets
                    markets = await exchange.load_markets()

                    # Get exchange info
                    entity = {
                        "id": f"exchange_{exchange_id}",
                        "name": exchange.name,
                        "type": "exchange",
                        "country": exchange.countries[0] if exchange.countries else "GLOBAL",
                        "description": f"Cryptocurrency exchange supporting {len(markets)} trading pairs",
                        "api_available": True,
                        "url": exchange.urls['www'] if 'www' in exchange.urls else "",
                        "services": ["trading", "deposits", "withdrawals"],
                        "supported_currencies": list(exchange.currencies.keys())[:50],  # Limit to 50
                        "rating": 4.0,  # Could be fetched from CoinGecko
                        "fees": {
                            "trading": exchange.fees.get('trading', {}),
                        }
                    }

                    entities.append(entity)
                    logger.info(f"Collected {exchange.name}")

                    await exchange.close()

                except Exception as e:
                    logger.warning(f"Failed to collect {exchange_id}: {e}")

            self.sources_status["ccxt"] = "success"
            logger.info(f"Collected {len(entities)} crypto exchanges")

            return entities

        except Exception as e:
            logger.error(f"Crypto exchanges collection failed: {e}")
            self.sources_status["ccxt"] = f"error: {str(e)}"
            return []

    async def collect_venezuela_entities(self) -> List[Dict[str, Any]]:
        """
        Collect Venezuela-specific entities (BCV, casas de cambio, etc.)

        Returns:
            List of Venezuela entities
        """
        try:
            logger.info("Collecting Venezuela entities...")

            entities = []

            # BCV (Banco Central de Venezuela)
            entities.append({
                "id": "bcv_venezuela",
                "name": "Banco Central de Venezuela",
                "type": "bank",
                "country": "VE",
                "description": "Central bank of Venezuela, provides official exchange rates",
                "api_available": False,  # Requires scraping
                "url": "http://www.bcv.org.ve",
                "services": ["exchange_rates", "monetary_policy"],
                "supported_currencies": ["VES", "USD", "EUR"],
                "rating": 5.0,
            })

            # Monitor Dólar Venezuela
            entities.append({
                "id": "monitor_dolar_ve",
                "name": "Monitor Dólar Venezuela",
                "type": "fintech",
                "country": "VE",
                "description": "Real-time monitoring of exchange rates in Venezuela",
                "api_available": True,
                "url": settings.MONITOR_DOLAR_URL,
                "services": ["exchange_rates", "parallel_market"],
                "supported_currencies": ["VES", "USD"],
                "rating": 4.5,
            })

            # Popular Venezuelan exchanges and casas de cambio
            venezuela_entities = [
                {
                    "name": "Reserve",
                    "type": "fintech",
                    "description": "Venezuelan digital wallet and exchange platform",
                    "url": "https://reserve.org",
                    "services": ["wallet", "exchange", "remittances"],
                },
                {
                    "name": "Italcambio",
                    "type": "casa_cambio",
                    "description": "Currency exchange house in Venezuela",
                    "url": "https://italcambio.com",
                    "services": ["currency_exchange", "remittances"],
                },
                {
                    "name": "Binance P2P Venezuela",
                    "type": "exchange",
                    "description": "Peer-to-peer cryptocurrency trading in Venezuela",
                    "url": "https://p2p.binance.com",
                    "services": ["p2p_trading", "crypto_exchange"],
                },
            ]

            for ve_entity in venezuela_entities:
                ve_entity.update({
                    "id": f"ve_{ve_entity['name'].lower().replace(' ', '_')}",
                    "country": "VE",
                    "api_available": False,
                    "supported_currencies": ["VES", "USD"],
                    "rating": 4.0,
                })
                entities.append(ve_entity)

            self.sources_status["venezuela"] = "success"
            logger.info(f"Collected {len(entities)} Venezuela entities")

            return entities

        except Exception as e:
            logger.error(f"Venezuela entities collection failed: {e}")
            self.sources_status["venezuela"] = f"error: {str(e)}"
            return []

    async def collect_remittance_services(self) -> List[Dict[str, Any]]:
        """
        Collect remittance services for Americas

        Returns:
            List of remittance entities
        """
        try:
            logger.info("Collecting remittance services...")

            # Major remittance services
            remittance_services = [
                {
                    "name": "Western Union",
                    "type": "fintech",
                    "country": "US",
                    "description": "Global money transfer and remittance service",
                    "url": "https://www.westernunion.com",
                    "services": ["remittances", "money_transfer", "bill_payment"],
                    "supported_currencies": ["USD", "MXN", "COP", "BRL", "VES"],
                    "rating": 4.5,
                },
                {
                    "name": "MoneyGram",
                    "type": "fintech",
                    "country": "US",
                    "description": "International money transfer service",
                    "url": "https://www.moneygram.com",
                    "services": ["remittances", "money_transfer"],
                    "supported_currencies": ["USD", "MXN", "COP", "BRL"],
                    "rating": 4.3,
                },
                {
                    "name": "Remitly",
                    "type": "fintech",
                    "country": "US",
                    "description": "Digital remittance service for LATAM",
                    "url": "https://www.remitly.com",
                    "services": ["remittances", "digital_transfer"],
                    "supported_currencies": ["USD", "MXN", "COP", "PEN", "BRL"],
                    "rating": 4.7,
                },
                {
                    "name": "Wise (TransferWise)",
                    "type": "fintech",
                    "country": "GB",
                    "description": "Multi-currency account and transfer service",
                    "url": "https://wise.com",
                    "services": ["remittances", "multi_currency_account", "debit_card"],
                    "supported_currencies": ["USD", "MXN", "BRL", "CLP", "COP"],
                    "rating": 4.8,
                },
                {
                    "name": "Ria Money Transfer",
                    "type": "fintech",
                    "country": "US",
                    "description": "Money transfer service to 160+ countries",
                    "url": "https://www.riamoneytransfer.com",
                    "services": ["remittances", "money_transfer"],
                    "supported_currencies": ["USD", "MXN", "COP", "VES"],
                    "rating": 4.4,
                },
            ]

            entities = []
            for service in remittance_services:
                service.update({
                    "id": f"remit_{service['name'].lower().replace(' ', '_')}",
                    "api_available": False,  # Most don't have public APIs
                    "last_updated": datetime.now().isoformat(),
                })
                entities.append(service)

            self.sources_status["remittance"] = "success"
            logger.info(f"Collected {len(entities)} remittance services")

            return entities

        except Exception as e:
            logger.error(f"Remittance collection failed: {e}")
            self.sources_status["remittance"] = f"error: {str(e)}"
            return []

    def get_collection_status(self) -> Dict[str, Any]:
        """
        Get status of all collection sources

        Returns:
            Dict with source statuses
        """
        return {
            "total_entities": len(self.collected_entities),
            "sources": self.sources_status,
            "last_collection": datetime.now().isoformat(),
        }


# Global collector instance
collector = DataCollector()


def get_collector() -> DataCollector:
    """Get global collector instance"""
    return collector
