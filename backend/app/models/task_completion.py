import enum
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, Integer, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base


class TaskType(str, enum.Enum):
    WORKOUT = "workout"
    WATER = "water"
    DIET = "diet"
    COMMIT = "commit"   # auto-checked via GitHub API
    STUDY = "study"     # 10 min daily study
    PHOTO = "photo"     # progress photo


ALL_TASKS = list(TaskType)


class TaskCompletion(Base):
    """One row per task per daily_log. Created alongside DailyLog with
    is_complete=False; the COMMIT row is updated by the GitHub poller."""

    __tablename__ = "task_completions"
    __table_args__ = (
        UniqueConstraint("daily_log_id", "task_type", name="uq_log_task"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    daily_log_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("daily_logs.id", ondelete="CASCADE"), nullable=False, index=True
    )
    task_type: Mapped[TaskType] = mapped_column(Enum(TaskType), nullable=False)
    is_complete: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    daily_log = relationship("DailyLog", back_populates="task_completions")
