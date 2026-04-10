from pydantic import BaseModel


class StatsResponse(BaseModel):
    current_streak: int
    longest_streak: int
    total_complete_days: int
    total_logged_days: int
    task_completion_rates: dict[str, float]
