from pydantic import BaseModel, field_validator


class VoteCreate(BaseModel):
    value: int

    @field_validator("value")
    @classmethod
    def value_must_be_one_or_neg_one(cls, v: int) -> int:
        if v not in (1, -1):
            raise ValueError("value must be 1 or -1")
        return v


class VoteRead(BaseModel):
    id: int
    user_id: int
    post_id: int
    value: int

    model_config = {"from_attributes": True}
