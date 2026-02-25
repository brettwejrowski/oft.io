from datetime import datetime

from pydantic import BaseModel


class CommentCreate(BaseModel):
    body: str
    parent_comment_id: int | None = None


class CommentRead(BaseModel):
    id: int
    body: str
    user_id: int
    post_id: int
    parent_comment_id: int | None
    created_at: datetime

    model_config = {"from_attributes": True}
