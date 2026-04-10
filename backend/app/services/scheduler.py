"""
APScheduler job: polls GitHub once per day (default 11:55 PM) and auto-updates
today's COMMIT task for the single registered user.
"""

import logging
from contextlib import asynccontextmanager

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from fastapi import FastAPI

from ..database import SessionLocal
from ..models.user import User
from .github import check_and_persist

logger = logging.getLogger(__name__)

_scheduler = AsyncIOScheduler()


async def _run_github_check() -> None:
    db = SessionLocal()
    try:
        user = db.query(User).first()
        if user is None:
            logger.warning("GitHub check skipped: no user registered yet")
            return
        found = await check_and_persist(db, user.id)
        logger.info("GitHub daily check complete — commit found: %s", found)
    except Exception:
        logger.exception("GitHub daily check failed")
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    _scheduler.add_job(
        _run_github_check,
        CronTrigger(hour=23, minute=55),  # 11:55 PM server-local time
        id="github_daily_check",
        replace_existing=True,
    )
    _scheduler.start()
    logger.info("Scheduler started — GitHub check at 23:55 daily")
    yield
    _scheduler.shutdown(wait=False)
    logger.info("Scheduler stopped")
