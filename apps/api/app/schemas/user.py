from datetime import datetime

from pydantic import BaseModel, Field


class UserRead(BaseModel):
    id: int
    email: str
    username: str
    avatar_url: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class UsernameUpdate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, pattern=r"^[a-z0-9_]+$")
