from contextlib import asynccontextmanager
from datetime import datetime, timezone
import logging

from fastapi import Depends, FastAPI, HTTPException, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exception_handlers import http_exception_handler
from fastapi.responses import JSONResponse
from sqlalchemy import or_, text
from sqlalchemy.exc import IntegrityError, OperationalError
from sqlalchemy.orm import Session

from app.config import settings
from app.database import Base, engine, get_db
from app.deps import get_current_user
from app.models import KodUser, UserToken
from app.schemas import BalanceResponse, LoginRequest, MessageResponse, RegisterRequest
from app.security import create_access_token, hash_password, verify_password

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create database tables
    try:
        # Test database connection first
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        Base.metadata.create_all(bind=engine)
        logger.info("Database connection successful and tables created/verified")
    except OperationalError as e:
        logger.error(f"Database connection failed: {e}")
        logger.error("Please check your database configuration and ensure the database server is running")
        # Don't raise - let the app start, but database operations will fail with clear errors
    except Exception as e:
        logger.error(f"Unexpected error during database initialization: {e}")
    yield
    # Shutdown: (if needed, add cleanup code here)


app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/api/auth/register", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def register_user(payload: RegisterRequest, db: Session = Depends(get_db)) -> MessageResponse:
    duplicate = db.query(KodUser).filter(
        or_(
            KodUser.uname == payload.uname,
            KodUser.email == payload.email,
            KodUser.phone == payload.phone,
        )
    ).first()
    if duplicate:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="username/email/phone already exists")

    user = KodUser(
        uname=payload.uname,
        password_hash=hash_password(payload.password),
        email=payload.email,
        phone=payload.phone,
        role=payload.role,
    )

    db.add(user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="username/email/phone already exists")

    return MessageResponse(message="Registration successful")


@app.post("/api/auth/login", response_model=MessageResponse)
def login_user(payload: LoginRequest, response: Response, db: Session = Depends(get_db)) -> MessageResponse:
    user = db.query(KodUser).filter(KodUser.uname == payload.uname).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")

    token, expires_at = create_access_token(subject=user.uname, role=user.role)
    now = datetime.now(timezone.utc)

    token_row = db.query(UserToken).filter(UserToken.user_id == user.id).first()
    if token_row:
        token_row.token = token
        token_row.issued_at = now
        token_row.expires_at = expires_at
        token_row.is_active = True
    else:
        db.add(
            UserToken(
                user_id=user.id,
                token=token,
                issued_at=now,
                expires_at=expires_at,
                is_active=True,
            )
        )

    db.commit()

    response.set_cookie(
        key=settings.cookie_name,
        value=token,
        httponly=True,
        secure=settings.cookie_secure,
        samesite=settings.cookie_samesite,
        max_age=settings.jwt_expiration_seconds,
        path="/",
    )

    return MessageResponse(message="Login successful")


@app.get("/api/account/balance", response_model=BalanceResponse)
def get_balance(current_user: KodUser = Depends(get_current_user)) -> BalanceResponse:
    return BalanceResponse(balance=current_user.balance)


@app.exception_handler(HTTPException)
async def handle_http_exception(request: Request, exc: HTTPException):
    return await http_exception_handler(request, exc)


@app.exception_handler(Exception)
def handle_generic_exception(_: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})
