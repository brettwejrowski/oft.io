from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://placewise:placewise@localhost:5432/placewise"
    google_client_id: str = ""
    google_client_secret: str = ""
    jwt_secret: str = "change-me"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 10080  # 7 days
    cors_origins: str = "http://localhost:5173,http://localhost:8081"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
