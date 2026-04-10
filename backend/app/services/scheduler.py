"""
APScheduler job: polls GitHub once per day (default 11:55 PM) and auto-updates
today's COMMIT task for the single registered user.
"""

import logging
import os
from contextlib import asynccontextmanager

from alembic import command as alembic_command
from alembic.config import Config
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from fastapi import FastAPI

from ..database import SessionLocal
from ..models.user import User
from .github import check_and_persist

logger = logging.getLogger(__name__)

# Path to alembic.ini — one level above this package (backend/)
_ALEMBIC_INI = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "alembic.ini")


def run_migrations() -> None:
    cfg = Config(_ALEMBIC_INI)
    alembic_command.upgrade(cfg, "head")
    logger.info("Database migrations applied")

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
    run_migrations()
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
