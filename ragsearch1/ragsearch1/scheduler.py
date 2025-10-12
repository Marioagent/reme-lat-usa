"""
Scheduler for RAGSearch1
Handles periodic data updates and maintenance tasks
"""

import logging
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from datetime import datetime
import asyncio

from .config import settings
from .collector import get_collector
from .processor import get_processor
from .vectordb import get_vector_db

logger = logging.getLogger(__name__)


class TaskScheduler:
    """
    Manages scheduled tasks for data updates
    """

    def __init__(self):
        """Initialize scheduler"""
        self.scheduler = AsyncIOScheduler(timezone=settings.SCHEDULER_TIMEZONE)
        self.collector = get_collector()
        self.processor = get_processor()
        self.vector_db = get_vector_db()
        self.is_running = False

    def start(self):
        """Start the scheduler with all configured tasks"""
        if self.is_running:
            logger.warning("Scheduler is already running")
            return

        if not settings.SCHEDULER_ENABLE:
            logger.info("Scheduler is disabled in settings")
            return

        try:
            # Task 1: Update crypto exchanges (every 15 minutes)
            self.scheduler.add_job(
                self.update_exchanges,
                trigger=IntervalTrigger(seconds=settings.UPDATE_EXCHANGES_INTERVAL),
                id='update_exchanges',
                name='Update Crypto Exchanges',
                replace_existing=True
            )

            # Task 2: Update BCV rates (every 30 minutes)
            self.scheduler.add_job(
                self.update_bcv_rates,
                trigger=IntervalTrigger(seconds=settings.UPDATE_BCV_INTERVAL),
                id='update_bcv',
                name='Update BCV Rates',
                replace_existing=True
            )

            # Task 3: Update banking institutions (every 24 hours)
            self.scheduler.add_job(
                self.update_banks,
                trigger=IntervalTrigger(seconds=settings.UPDATE_BANKS_INTERVAL),
                id='update_banks',
                name='Update Banking Institutions',
                replace_existing=True
            )

            # Task 4: Discovery of new entities (every 7 days)
            self.scheduler.add_job(
                self.discover_new_entities,
                trigger=IntervalTrigger(seconds=settings.UPDATE_DISCOVERY_INTERVAL),
                id='discover_entities',
                name='Discover New Entities',
                replace_existing=True
            )

            # Task 5: Database maintenance (every 24 hours)
            self.scheduler.add_job(
                self.database_maintenance,
                trigger=IntervalTrigger(seconds=86400),  # 24 hours
                id='db_maintenance',
                name='Database Maintenance',
                replace_existing=True
            )

            # Start scheduler
            self.scheduler.start()
            self.is_running = True

            logger.info("Scheduler started successfully")
            logger.info(f"Scheduled {len(self.scheduler.get_jobs())} tasks")

        except Exception as e:
            logger.error(f"Failed to start scheduler: {e}")
            raise

    def stop(self):
        """Stop the scheduler"""
        if not self.is_running:
            logger.warning("Scheduler is not running")
            return

        try:
            self.scheduler.shutdown(wait=False)
            self.is_running = False
            logger.info("Scheduler stopped")

        except Exception as e:
            logger.error(f"Failed to stop scheduler: {e}")

    async def update_exchanges(self):
        """Update crypto exchange data"""
        try:
            logger.info("Starting crypto exchanges update...")

            # Collect latest exchange data
            exchanges = await self.collector.collect_crypto_exchanges()

            if not exchanges:
                logger.warning("No exchange data collected")
                return

            # Process and update vector database
            documents, metadatas, ids, embeddings = self.processor.process_entity_batch(exchanges)

            # Update or add to vector DB
            for i, entity_id in enumerate(ids):
                existing = self.vector_db.get_entity_by_id(entity_id)

                if existing:
                    # Update existing
                    self.vector_db.update_document(
                        document_id=entity_id,
                        document=documents[i],
                        metadata=metadatas[i],
                        embedding=embeddings[i]
                    )
                else:
                    # Add new
                    self.vector_db.add_documents(
                        documents=[documents[i]],
                        metadatas=[metadatas[i]],
                        ids=[entity_id],
                        embeddings=[embeddings[i]]
                    )

            logger.info(f"Updated {len(exchanges)} crypto exchanges")

        except Exception as e:
            logger.error(f"Exchange update failed: {e}")

    async def update_bcv_rates(self):
        """Update Venezuela BCV rates"""
        try:
            logger.info("Starting BCV rates update...")

            # Collect Venezuela entities (includes BCV)
            ve_entities = await self.collector.collect_venezuela_entities()

            if not ve_entities:
                logger.warning("No Venezuela data collected")
                return

            # Process and update
            documents, metadatas, ids, embeddings = self.processor.process_entity_batch(ve_entities)

            for i, entity_id in enumerate(ids):
                existing = self.vector_db.get_entity_by_id(entity_id)

                if existing:
                    self.vector_db.update_document(
                        document_id=entity_id,
                        document=documents[i],
                        metadata=metadatas[i],
                        embedding=embeddings[i]
                    )
                else:
                    self.vector_db.add_documents(
                        documents=[documents[i]],
                        metadatas=[metadatas[i]],
                        ids=[entity_id],
                        embeddings=[embeddings[i]]
                    )

            logger.info(f"Updated {len(ve_entities)} Venezuela entities")

        except Exception as e:
            logger.error(f"BCV update failed: {e}")

    async def update_banks(self):
        """Update banking institutions"""
        try:
            logger.info("Starting banks update...")

            # Collect from Plaid and Belvo
            tasks = []

            if settings.PLAID_CLIENT_ID:
                tasks.append(self.collector.collect_plaid_institutions())

            if settings.BELVO_SECRET_ID:
                tasks.append(self.collector.collect_belvo_institutions())

            results = await asyncio.gather(*tasks, return_exceptions=True)

            all_banks = []
            for result in results:
                if isinstance(result, list):
                    all_banks.extend(result)

            if not all_banks:
                logger.warning("No banking data collected")
                return

            # Process and update
            documents, metadatas, ids, embeddings = self.processor.process_entity_batch(all_banks)

            for i, entity_id in enumerate(ids):
                existing = self.vector_db.get_entity_by_id(entity_id)

                if existing:
                    self.vector_db.update_document(
                        document_id=entity_id,
                        document=documents[i],
                        metadata=metadatas[i],
                        embedding=embeddings[i]
                    )
                else:
                    self.vector_db.add_documents(
                        documents=[documents[i]],
                        metadatas=[metadatas[i]],
                        ids=[entity_id],
                        embeddings=[embeddings[i]]
                    )

            logger.info(f"Updated {len(all_banks)} banking institutions")

        except Exception as e:
            logger.error(f"Banks update failed: {e}")

    async def discover_new_entities(self):
        """Discover and add new financial entities"""
        try:
            logger.info("Starting entity discovery...")

            # Collect all available data
            all_entities = await self.collector.collect_all()

            if not all_entities:
                logger.warning("No entities discovered")
                return

            # Deduplicate
            unique_entities = self.processor.deduplicate_entities(all_entities)

            # Filter only new entities (not in DB)
            new_entities = []
            for entity in unique_entities:
                entity_id = self.processor._generate_id(entity)
                existing = self.vector_db.get_entity_by_id(entity_id)

                if not existing:
                    new_entities.append(entity)

            if not new_entities:
                logger.info("No new entities to add")
                return

            # Process and add to vector DB
            documents, metadatas, ids, embeddings = self.processor.process_entity_batch(new_entities)

            self.vector_db.add_documents(
                documents=documents,
                metadatas=metadatas,
                ids=ids,
                embeddings=embeddings
            )

            logger.info(f"Discovered and added {len(new_entities)} new entities")

        except Exception as e:
            logger.error(f"Entity discovery failed: {e}")

    async def database_maintenance(self):
        """Perform database maintenance tasks"""
        try:
            logger.info("Starting database maintenance...")

            # Get database stats
            stats = self.vector_db.get_collection_stats()
            logger.info(f"Database stats: {stats}")

            # TODO: Add cleanup logic here
            # - Remove outdated entities
            # - Update timestamps
            # - Optimize indexes

            logger.info("Database maintenance completed")

        except Exception as e:
            logger.error(f"Database maintenance failed: {e}")

    def get_job_status(self):
        """Get status of all scheduled jobs"""
        jobs = self.scheduler.get_jobs()

        return {
            "is_running": self.is_running,
            "timezone": settings.SCHEDULER_TIMEZONE,
            "jobs": [
                {
                    "id": job.id,
                    "name": job.name,
                    "next_run": job.next_run_time.isoformat() if job.next_run_time else None,
                }
                for job in jobs
            ]
        }


# Global scheduler instance
scheduler = TaskScheduler()


def get_scheduler() -> TaskScheduler:
    """Get global scheduler instance"""
    return scheduler
