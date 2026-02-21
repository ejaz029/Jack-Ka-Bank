import logging
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import declarative_base, sessionmaker

from app.config import settings

logger = logging.getLogger(__name__)

# Select a sensible default database for local development.
# - In dev (APP_ENV=dev), use SQLite by default, but allow MySQL if DATABASE_URL is explicitly set.
# - In other environments (e.g. production), use the configured DATABASE_URL.
if settings.app_env == "dev":
    # Use MySQL if DATABASE_URL is set to a MySQL connection string, otherwise use SQLite
    if settings.database_url and settings.database_url.startswith("mysql"):
        # Test MySQL connection - if it fails, fall back to SQLite
        try:
            test_engine = create_engine(settings.database_url, pool_pre_ping=True)
            with test_engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            SQLALCHEMY_DATABASE_URL = settings.database_url
            logger.info("Using MySQL database as configured")
        except Exception as e:
            logger.warning(f"MySQL connection failed: {e}. Falling back to SQLite.")
            SQLALCHEMY_DATABASE_URL = "sqlite:///./jack_ka_bank.db"
    else:
        SQLALCHEMY_DATABASE_URL = "sqlite:///./jack_ka_bank.db"
else:
    SQLALCHEMY_DATABASE_URL = settings.database_url

connect_args = {}
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    # Needed so SQLite can be safely used with FastAPI's threaded environment.
    connect_args = {"check_same_thread": False}

engine = create_engine(SQLALCHEMY_DATABASE_URL, pool_pre_ping=True, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
