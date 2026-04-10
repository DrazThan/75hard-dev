from datetime import datetime
from typing import Optional

from pydantic import BaseModel, field_validator


class UserCreate(BaseModel):
    username: str
    password: str
    github_username: Optional[str] = None

    @field_validator("username")
    @classmethod
    def username_nonempty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("username cannot be blank")
        return v


class UserLogin(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    github_username: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
