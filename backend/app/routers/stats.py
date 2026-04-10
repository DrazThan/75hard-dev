from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..dependencies import get_current_user
from ..models.daily_log import DailyLog
from ..models.user import User
from ..schemas.stats import StatsResponse
from ..services import streak as streak_svc

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("", response_model=StatsResponse)
def stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    total_logged = db.query(DailyLog).filter(DailyLog.user_id == current_user.id).count()
    total_complete = (
        db.query(DailyLog)
        .filter(DailyLog.user_id == current_user.id, DailyLog.is_complete.is_(True))
        .count()
    )
    return StatsResponse(
        current_streak=streak_svc.current_streak(db, current_user.id),
        longest_streak=streak_svc.longest_streak(db, current_user.id),
        total_complete_days=total_complete,
        total_logged_days=total_logged,
        task_completion_rates=streak_svc.task_completion_rates(db, current_user.id),
    )
