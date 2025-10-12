"""
Admin endpoints for RAGSearch1 API
System management and monitoring
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks
import logging

from ragsearch1.vectordb import get_vector_db
from ragsearch1.scheduler import get_scheduler
from ragsearch1.collector import get_collector
from ragsearch1.processor import get_processor
from ..models import (
    CollectionStatsResponse,
    SchedulerStatusResponse,
    DataCollectionStatusResponse
)

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/stats", response_model=CollectionStatsResponse)
async def get_collection_stats():
    """
    Get vector database collection statistics

    Returns:
    - Collection name
    - Total number of indexed entities
    - Collection metadata
    """
    try:
        vector_db = get_vector_db()
        stats = vector_db.get_collection_stats()

        return CollectionStatsResponse(
            name=stats.get('name', 'unknown'),
            count=stats.get('count', 0),
            metadata=stats.get('metadata', {})
        )

    except Exception as e:
        logger.error(f"Get stats failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/scheduler/status", response_model=SchedulerStatusResponse)
async def get_scheduler_status():
    """
    Get scheduler status and job information

    Returns:
    - Running status
    - Configured timezone
    - List of scheduled jobs with next run times
    """
    try:
        scheduler = get_scheduler()
        status = scheduler.get_job_status()

        return SchedulerStatusResponse(
            is_running=status['is_running'],
            timezone=status['timezone'],
            jobs=status['jobs']
        )

    except Exception as e:
        logger.error(f"Get scheduler status failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/scheduler/start")
async def start_scheduler():
    """
    Start the scheduler

    Begins automatic data collection and update tasks.
    """
    try:
        scheduler = get_scheduler()
        scheduler.start()

        return {
            "message": "Scheduler started successfully",
            "status": "running"
        }

    except Exception as e:
        logger.error(f"Start scheduler failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/scheduler/stop")
async def stop_scheduler():
    """
    Stop the scheduler

    Stops all automatic data collection tasks.
    """
    try:
        scheduler = get_scheduler()
        scheduler.stop()

        return {
            "message": "Scheduler stopped successfully",
            "status": "stopped"
        }

    except Exception as e:
        logger.error(f"Stop scheduler failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/collection/status", response_model=DataCollectionStatusResponse)
async def get_collection_status():
    """
    Get data collection status

    Returns:
    - Total entities collected
    - Status of each data source (success/error)
    - Last collection timestamp
    """
    try:
        collector = get_collector()
        status = collector.get_collection_status()

        return DataCollectionStatusResponse(
            total_entities=status['total_entities'],
            sources=status['sources'],
            last_collection=status['last_collection']
        )

    except Exception as e:
        logger.error(f"Get collection status failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/collection/run")
async def run_collection(background_tasks: BackgroundTasks):
    """
    Trigger data collection manually

    Runs data collection in the background and returns immediately.
    Use /admin/collection/status to check progress.
    """
    try:
        async def collect_data():
            """Background task for data collection"""
            try:
                collector = get_collector()
                processor = get_processor()
                vector_db = get_vector_db()

                # Collect data
                logger.info("Starting manual data collection...")
                entities = await collector.collect_all()

                if not entities:
                    logger.warning("No entities collected")
                    return

                # Process entities
                logger.info(f"Processing {len(entities)} entities...")
                documents, metadatas, ids, embeddings = processor.process_entity_batch(entities)

                # Add to vector database
                logger.info(f"Adding {len(documents)} documents to vector DB...")
                success = vector_db.add_documents(
                    documents=documents,
                    metadatas=metadatas,
                    ids=ids,
                    embeddings=embeddings
                )

                if success:
                    logger.info(f"Manual collection completed: {len(entities)} entities added")
                else:
                    logger.error("Failed to add documents to vector DB")

            except Exception as e:
                logger.error(f"Manual collection failed: {e}")

        # Add to background tasks
        background_tasks.add_task(collect_data)

        return {
            "message": "Data collection started in background",
            "status": "running"
        }

    except Exception as e:
        logger.error(f"Run collection failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/collection/update/{entity_type}")
async def update_entity_type(entity_type: str, background_tasks: BackgroundTasks):
    """
    Update a specific type of entities

    Args:
        entity_type: Type to update (exchanges, banks, venezuela, remittance)

    Runs update in the background.
    """
    try:
        async def update_type():
            """Background task for type-specific update"""
            try:
                collector = get_collector()
                processor = get_processor()
                vector_db = get_vector_db()

                # Collect based on type
                if entity_type == "exchanges":
                    entities = await collector.collect_crypto_exchanges()
                elif entity_type == "banks":
                    from ragsearch1.collector import asyncio
                    tasks = []
                    if collector.sources_status.get("plaid"):
                        tasks.append(collector.collect_plaid_institutions())
                    if collector.sources_status.get("belvo"):
                        tasks.append(collector.collect_belvo_institutions())
                    results = await asyncio.gather(*tasks, return_exceptions=True)
                    entities = []
                    for r in results:
                        if isinstance(r, list):
                            entities.extend(r)
                elif entity_type == "venezuela":
                    entities = await collector.collect_venezuela_entities()
                elif entity_type == "remittance":
                    entities = await collector.collect_remittance_services()
                else:
                    logger.error(f"Unknown entity type: {entity_type}")
                    return

                if not entities:
                    logger.warning(f"No {entity_type} entities collected")
                    return

                # Process and update
                documents, metadatas, ids, embeddings = processor.process_entity_batch(entities)

                for i, entity_id in enumerate(ids):
                    existing = vector_db.get_entity_by_id(entity_id)

                    if existing:
                        vector_db.update_document(
                            document_id=entity_id,
                            document=documents[i],
                            metadata=metadatas[i],
                            embedding=embeddings[i]
                        )
                    else:
                        vector_db.add_documents(
                            documents=[documents[i]],
                            metadatas=[metadatas[i]],
                            ids=[entity_id],
                            embeddings=[embeddings[i]]
                        )

                logger.info(f"Updated {len(entities)} {entity_type} entities")

            except Exception as e:
                logger.error(f"Update {entity_type} failed: {e}")

        # Add to background tasks
        background_tasks.add_task(update_type)

        return {
            "message": f"Update of {entity_type} started in background",
            "entity_type": entity_type,
            "status": "running"
        }

    except Exception as e:
        logger.error(f"Update entity type failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/collection/reset")
async def reset_collection():
    """
    Reset the entire collection (DANGER!)

    This will delete ALL indexed data. Use with extreme caution.
    Only use this for testing or when rebuilding the index from scratch.
    """
    try:
        vector_db = get_vector_db()

        # Get confirmation from user (in production, require auth token)
        success = vector_db.reset_collection()

        if success:
            return {
                "message": "Collection has been reset",
                "status": "empty",
                "warning": "All data has been deleted"
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to reset collection")

    except Exception as e:
        logger.error(f"Reset collection failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def admin_health_check():
    """
    Detailed health check for all components

    Returns status of:
    - Vector database
    - Scheduler
    - Data collection
    """
    try:
        health_status = {
            "overall": "healthy",
            "components": {}
        }

        # Check vector database
        try:
            vector_db = get_vector_db()
            stats = vector_db.get_collection_stats()
            health_status["components"]["vector_db"] = {
                "status": "healthy",
                "entity_count": stats.get('count', 0)
            }
        except Exception as e:
            health_status["components"]["vector_db"] = {
                "status": "unhealthy",
                "error": str(e)
            }
            health_status["overall"] = "degraded"

        # Check scheduler
        try:
            scheduler = get_scheduler()
            status = scheduler.get_job_status()
            health_status["components"]["scheduler"] = {
                "status": "healthy" if status['is_running'] else "stopped",
                "job_count": len(status['jobs'])
            }
        except Exception as e:
            health_status["components"]["scheduler"] = {
                "status": "unhealthy",
                "error": str(e)
            }

        # Check data collection
        try:
            collector = get_collector()
            status = collector.get_collection_status()
            health_status["components"]["collector"] = {
                "status": "healthy",
                "total_entities": status['total_entities'],
                "sources": status['sources']
            }
        except Exception as e:
            health_status["components"]["collector"] = {
                "status": "unhealthy",
                "error": str(e)
            }

        return health_status

    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
