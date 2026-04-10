from datetime import date

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..dependencies import get_current_user
from ..models.task_completion import TaskType
from ..models.user import User
from ..schemas.daily_log import DailyLogResponse, DailyLogSummary
from ..schemas.task_completion import TaskCompletionResponse, TaskCompletionUpdate
from ..services.logs import get_log_by_date, get_or_create_today, set_task

router = APIRouter(prefix="/logs", tags=["logs"])


@router.get("/today", response_model=DailyLogResponse)
def today(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get (or initialise) today's log with all 6 task rows."""
    return get_or_create_today(db, current_user.id)


@router.patch("/today/tasks/{task_type}", response_model=TaskCompletionResponse)
def toggle_task(
    task_type: TaskType,
    body: TaskCompletionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Mark a task complete or incomplete for today."""
    log = get_or_create_today(db, current_user.id)
    return set_task(db, log, task_type, body.is_complete)


@router.get("/history", response_model=list[DailyLogSummary])
def history(
    year: int | None = None,
    month: int | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    All logged days for the calendar view.
    Optionally filter by ?year=2025&month=4
    """
    from ..models.daily_log import DailyLog

    q = db.query(DailyLog).filter(DailyLog.user_id == current_user.id)
    if year:
        from sqlalchemy import extract
        q = q.filter(extract("year", DailyLog.date) == year)
    if month:
        from sqlalchemy import extract
        q = q.filter(extract("month", DailyLog.date) == month)
    return q.order_by(DailyLog.date).all()


@router.get("/{log_date}", response_model=DailyLogResponse)
def by_date(
    log_date: date,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get a specific day's full log (with task detail)."""
    log = get_log_by_date(db, current_user.id, log_date)
    if log is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No log for that date")
    return log
