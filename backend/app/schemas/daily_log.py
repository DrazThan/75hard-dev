from datetime import date, datetime
from typing import List

from pydantic import BaseModel

from .task_completion import TaskCompletionResponse


class DailyLogResponse(BaseModel):
    id: int
    user_id: int
    date: date
    is_complete: bool
    created_at: datetime
    task_completions: List[TaskCompletionResponse] = []

    model_config = {"from_attributes": True}


class DailyLogSummary(BaseModel):
    """Lightweight response used in history/calendar views (no task detail)."""

    date: date
    is_complete: bool

    model_config = {"from_attributes": True}
