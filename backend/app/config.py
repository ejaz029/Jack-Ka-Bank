from pathlib import Path
from urllib.parse import quote, unquote, urlparse, urlunparse

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

# Load .env from backend folder so it works whether you run from backend/ or project root
_BACKEND_ROOT = Path(__file__).resolve().parent.parent
_ENV_FILE = _BACKEND_ROOT / ".env"


def _normalize_mysql_database_name(url: str) -> str:
    """Replace spaces in MySQL database name with underscores (e.g. 'jack ka bank' -> 'jack_ka_bank')."""
    if not url or not url.strip().lower().startswith("mysql"):
        return url
    parsed = urlparse(url)
    path = parsed.path.lstrip("/")
    if not path:
        return url
    # Decode %20 to space, then replace any space with underscore
    name = unquote(path).replace(" ", "_")
    new_path = "/" + quote(name, safe="")
    return urlunparse(parsed._replace(path=new_path))


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=_ENV_FILE if _ENV_FILE.exists() else ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "Jack Ka Bank"
    app_env: str = "dev"
    app_host: str = "0.0.0.0"
    app_port: int = 8000

    database_url: str = "sqlite:///./jack_ka_bank.db"

    @model_validator(mode="after")
    def normalize_database_url(self):
        self.database_url = _normalize_mysql_database_name(self.database_url)
        return self

    jwt_secret: str = "replace-with-at-least-32-characters-secret"
    jwt_algorithm: str = "HS256"
    jwt_expiration_seconds: int = 86400

    cookie_name: str = "jack_ka_bank_token"
    cookie_secure: bool = False
    cookie_samesite: str = "lax"

    frontend_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    @model_validator(mode="after")
    def normalize_cookie_name(self):
        # Cookie names must not contain spaces (RFC 6265)
        self.cookie_name = self.cookie_name.replace(" ", "_").strip() or "jack_ka_bank_token"
        return self

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.frontend_origins.split(",") if origin.strip()]


settings = Settings()
