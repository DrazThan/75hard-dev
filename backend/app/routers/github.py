from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from ..database import get_db
from ..dependencies import get_current_user
from ..models.user import User
from ..services.github import check_and_persist

router = APIRouter(prefix="/github", tags=["github"])


class CommitCheckResponse(BaseModel):
    commit_found: bool
    message: str


@router.post("/check", response_model=CommitCheckResponse)
async def manual_check(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Manually trigger today's GitHub commit check.
    The scheduler runs this automatically at 23:55 — use this endpoint to
    force a re-check at any time (e.g. after pushing a commit).
    """
    try:
        found = await check_and_persist(db, current_user.id)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"GitHub API error: {exc}",
        ) from exc

    msg = "Commit found — task marked complete!" if found else "No personal repo commit found yet today."
    return CommitCheckResponse(commit_found=found, message=msg)
