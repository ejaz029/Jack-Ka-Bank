from datetime import datetime, timezone

from fastapi import Cookie, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models import KodUser, UserToken
from app.security import decode_access_token


def get_current_user(
    db: Session = Depends(get_db),
    token_cookie: str | None = Cookie(default=None, alias=settings.cookie_name),
) -> KodUser:
    if not token_cookie:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing auth token")

    try:
        payload = decode_access_token(token_cookie)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    uname = payload.get("sub")
    if not uname:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")

    user = db.query(KodUser).filter(KodUser.uname == uname).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    token_row = db.query(UserToken).filter(UserToken.user_id == user.id, UserToken.is_active.is_(True)).first()
    if not token_row:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Inactive token")

    if token_row.token != token_cookie:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token mismatch")

    if token_row.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")

    return user
