from cryptography.fernet import Fernet
from sqlalchemy import String
from sqlalchemy.types import TypeDecorator
from ..config import get_settings


def get_fernet() -> Fernet:
    key = get_settings().ENCRYPTION_KEY
    return Fernet(key.encode() if isinstance(key, str) else key)


class EncryptedString(TypeDecorator):
    """SQLAlchemy column type that transparently encrypts/decrypts values at rest."""

    impl = String
    cache_ok = True

    def process_bind_param(self, value: str | None, dialect) -> str | None:
        """Encrypt before writing to DB."""
        if value is None:
            return None
        return get_fernet().encrypt(value.encode()).decode()

    def process_result_value(self, value: str | None, dialect) -> str | None:
        """Decrypt after reading from DB."""
        if value is None:
            return None
        return get_fernet().decrypt(value.encode()).decode()
