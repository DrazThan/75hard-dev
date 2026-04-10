"""
GitHub commit checker.

"Personal repos only" means repos where the owner login matches GITHUB_USERNAME
(i.e. repos under the user's own account, not under any organisation).
If work repos live in an org, they're automatically excluded.
If work repos are under the personal account, list them in EXCLUDED_REPOS in config.
"""

from datetime import date, datetime, timezone

import httpx
from sqlalchemy.orm import Session

from ..config import get_settings
from ..models.daily_log import DailyLog
from ..models.task_completion import TaskCompletion, TaskType
from .logs import _sync_log_completion, get_or_create_today

_GITHUB_API = "https://api.github.com"


async def _push_events_today(github_username: str, token: str = "") -> bool:
    """Return True if github_username pushed to a personal repo today."""
    today = date.today().isoformat()
    headers = {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"

    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.get(
            f"{_GITHUB_API}/users/{github_username}/events",
            headers=headers,
            params={"per_page": 100},
        )
        resp.raise_for_status()
        events = resp.json()

    for event in events:
        if event.get("type") != "PushEvent":
            continue
        # Personal repo: owner segment of "owner/repo" == github_username
        repo_name: str = event.get("repo", {}).get("name", "")
        if not repo_name.lower().startswith(f"{github_username.lower()}/"):
            continue
        created_at: str = event.get("created_at", "")
        if created_at.startswith(today):
            return True

    return False


async def check_and_persist(db: Session, user_id: int) -> bool:
    """
    Poll GitHub for today's personal commit, update the COMMIT TaskCompletion row,
    and sync the parent DailyLog.is_complete.
    Returns True if a qualifying commit was found.
    """
    settings = get_settings()
    made_commit = await _push_events_today(settings.GITHUB_USERNAME, settings.GITHUB_TOKEN)

    log = get_or_create_today(db, user_id)

    commit_tc = next(
        (tc for tc in log.task_completions if tc.task_type == TaskType.COMMIT), None
    )
    if commit_tc is None:
        commit_tc = TaskCompletion(daily_log_id=log.id, task_type=TaskType.COMMIT)
        db.add(commit_tc)

    if commit_tc.is_complete != made_commit:
        commit_tc.is_complete = made_commit
        commit_tc.completed_at = datetime.now(timezone.utc) if made_commit else None
        _sync_log_completion(db, log)
        db.commit()

    return made_commit
