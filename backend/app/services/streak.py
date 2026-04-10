from datetime import date, timedelta

from sqlalchemy.orm import Session

from ..models.daily_log import DailyLog
from ..models.task_completion import TaskCompletion, TaskType


def current_streak(db: Session, user_id: int) -> int:
    """Consecutive complete days ending today (or yesterday if today is still in progress)."""
    today = date.today()

    today_log = (
        db.query(DailyLog)
        .filter(DailyLog.user_id == user_id, DailyLog.date == today)
        .first()
    )
    # If today is complete, count from today; otherwise start counting from yesterday
    # (today is still in-flight, not a broken streak yet)
    anchor = today if (today_log and today_log.is_complete) else today - timedelta(days=1)

    streak = 0
    check = anchor
    while True:
        log = (
            db.query(DailyLog)
            .filter(DailyLog.user_id == user_id, DailyLog.date == check)
            .first()
        )
        if log and log.is_complete:
            streak += 1
            check -= timedelta(days=1)
        else:
            break
    return streak


def longest_streak(db: Session, user_id: int) -> int:
    """All-time longest consecutive complete day run."""
    logs = (
        db.query(DailyLog)
        .filter(DailyLog.user_id == user_id, DailyLog.is_complete.is_(True))
        .order_by(DailyLog.date)
        .all()
    )
    if not logs:
        return 0

    best = current = 1
    for i in range(1, len(logs)):
        if logs[i].date - logs[i - 1].date == timedelta(days=1):
            current += 1
            best = max(best, current)
        else:
            current = 1
    return best


def task_completion_rates(db: Session, user_id: int) -> dict[str, float]:
    """Per-task completion % across all logged days. Returns 0.0 if no logs yet."""
    total = db.query(DailyLog).filter(DailyLog.user_id == user_id).count()
    if total == 0:
        return {t.value: 0.0 for t in TaskType}

    rates: dict[str, float] = {}
    for task_type in TaskType:
        completed = (
            db.query(TaskCompletion)
            .join(DailyLog)
            .filter(
                DailyLog.user_id == user_id,
                TaskCompletion.task_type == task_type,
                TaskCompletion.is_complete.is_(True),
            )
            .count()
        )
        rates[task_type.value] = round(completed / total * 100, 1)
    return rates
