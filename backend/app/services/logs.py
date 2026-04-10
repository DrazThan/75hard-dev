from datetime import date, datetime, timezone

from sqlalchemy.orm import Session

from ..models.daily_log import DailyLog
from ..models.task_completion import ALL_TASKS, TaskCompletion, TaskType


def get_or_create_today(db: Session, user_id: int) -> DailyLog:
    """Return today's DailyLog, creating it (with all 6 TaskCompletion rows) if absent."""
    today = date.today()
    log = (
        db.query(DailyLog)
        .filter(DailyLog.user_id == user_id, DailyLog.date == today)
        .first()
    )
    if log:
        return log

    log = DailyLog(user_id=user_id, date=today, is_complete=False)
    db.add(log)
    db.flush()  # populate log.id before inserting children

    for task_type in ALL_TASKS:
        db.add(TaskCompletion(daily_log_id=log.id, task_type=task_type, is_complete=False))

    db.commit()
    db.refresh(log)
    return log


def get_log_by_date(db: Session, user_id: int, target_date: date) -> DailyLog | None:
    return (
        db.query(DailyLog)
        .filter(DailyLog.user_id == user_id, DailyLog.date == target_date)
        .first()
    )


def set_task(
    db: Session,
    log: DailyLog,
    task_type: TaskType,
    is_complete: bool,
) -> TaskCompletion:
    """Set a single task's completion state and sync the parent log's is_complete."""
    tc = next((t for t in log.task_completions if t.task_type == task_type), None)
    if tc is None:
        tc = TaskCompletion(daily_log_id=log.id, task_type=task_type)
        db.add(tc)

    tc.is_complete = is_complete
    tc.completed_at = datetime.now(timezone.utc) if is_complete else None
    db.flush()

    _sync_log_completion(db, log)
    db.commit()
    db.refresh(tc)
    return tc


def _sync_log_completion(db: Session, log: DailyLog) -> None:
    """Flip log.is_complete iff all 6 tasks are done."""
    all_done = len(log.task_completions) == len(ALL_TASKS) and all(
        tc.is_complete for tc in log.task_completions
    )
    if log.is_complete != all_done:
        log.is_complete = all_done
