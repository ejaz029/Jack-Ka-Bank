from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.config import settings


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# bcrypt has a 72-byte limit; truncate to avoid ValueError
_MAX_BCRYPT_BYTES = 72


def _truncate_for_bcrypt(password: str) -> str:
    data = password.encode("utf-8")
    if len(data) <= _MAX_BCRYPT_BYTES:
        return password
    return data[:_MAX_BCRYPT_BYTES].decode("utf-8", errors="ignore") or password[:1]


def hash_password(password: str) -> str:
    return pwd_context.hash(_truncate_for_bcrypt(password))


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(_truncate_for_bcrypt(plain_password), hashed_password)


def create_access_token(subject: str, role: str) -> tuple[str, datetime]:
    expire_at = datetime.now(timezone.utc) + timedelta(seconds=settings.jwt_expiration_seconds)
    payload = {
        "sub": subject,
        "role": role,
        "exp": expire_at,
    }
    encoded_jwt = jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)
    return encoded_jwt, expire_at


def decode_access_token(token: str) -> dict:
    try:
        return jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
    except JWTError as exc:
        raise ValueError("invalid token") from exc
