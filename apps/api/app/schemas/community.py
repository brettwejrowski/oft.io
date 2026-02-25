from datetime import datetime

from pydantic import BaseModel


class CommunityCreate(BaseModel):
    slug: str
    name: str
    description: str | None = None
    topic: str


class CommunityRead(BaseModel):
    id: int
    slug: str
    name: str
    description: str | None
    topic: str
    created_by: int
    created_at: datetime

    model_config = {"from_attributes": True}
