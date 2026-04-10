# Import all models here so Alembic autogenerate can discover them
from .user import User  # noqa: F401
from .daily_log import DailyLog  # noqa: F401
from .task_completion import TaskCompletion, TaskType  # noqa: F401
