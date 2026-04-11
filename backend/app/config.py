from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Fernet key — generate: from cryptography.fernet import Fernet; Fernet.generate_key()
    ENCRYPTION_KEY: str

    GITHUB_TOKEN: str = ""
    GITHUB_USERNAME: str = "DrazThan"

    # CORS — use "*" to allow all origins, or comma-separated URLs
    ALLOWED_ORIGINS: str = "*"

    # Logging — set to "DEBUG" for verbose request logging
    LOG_LEVEL: str = "INFO"

    # Environment label returned by /health
    ENVIRONMENT: str = "production"

    model_config = {"env_file": ".env"}


@lru_cache()
def get_settings() -> Settings:
    return Settings()
