from pydantic import BaseModel


class GoogleAuthRequest(BaseModel):
    token: str  # Google OAuth ID token


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    is_new_user: bool = False
