from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from ..models.task_completion import TaskType


class TaskCompletionResponse(BaseModel):
    id: int
    daily_log_id: int
    task_type: TaskType
    is_complete: bool
    completed_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class TaskCompletionUpdate(BaseModel):
    is_complete: bool
