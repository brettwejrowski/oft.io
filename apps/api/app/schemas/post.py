from datetime import datetime

from pydantic import BaseModel


class PostCreate(BaseModel):
    title: str
    body: str | None = None
    location_name: str
    location_lat: float
    location_lng: float
    external_url: str
    community_id: int


class PostRead(BaseModel):
    id: int
    title: str
    body: str | None
    location_name: str
    location_lat: float
    location_lng: float
    external_url: str
    user_id: int
    community_id: int
    score: int
    created_at: datetime

    model_config = {"from_attributes": True}


class NearbyParams(BaseModel):
    lat: float
    lng: float
    radius_km: float = 10.0
    limit: int = 50
