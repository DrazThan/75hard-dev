from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Fernet key — base64 urlsafe 32 bytes
    # Generate: from cryptography.fernet import Fernet; Fernet.generate_key()
    ENCRYPTION_KEY: str

    GITHUB_TOKEN: str = ""
    GITHUB_USERNAME: str = "DrazThan"

    model_config = {"env_file": ".env"}


@lru_cache()
def get_settings() -> Settings:
    return Settings()
