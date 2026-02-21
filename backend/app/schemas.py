import re
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class RegisterRequest(BaseModel):
    uname: str = Field(min_length=1, max_length=64)
    password: str = Field(min_length=8, max_length=128)
    email: EmailStr
    phone: str
    role: str

    @field_validator("role")
    @classmethod
    def validate_role(cls, value: str) -> str:
        if value.lower() != "customer":
            raise ValueError("role must be customer")
        return "CUSTOMER"

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: str) -> str:
        cleaned = re.sub(r"[\s\-\(\)]", "", value or "")
        if not re.fullmatch(r"^\+?[0-9]{7,15}$", cleaned):
            raise ValueError("phone must contain 7-15 digits (optional leading +)")
        return cleaned


class LoginRequest(BaseModel):
    uname: str = Field(min_length=1, max_length=64)
    password: str = Field(min_length=8, max_length=128)


class MessageResponse(BaseModel):
    message: str


class BalanceResponse(BaseModel):
    balance: Decimal

    model_config = ConfigDict(from_attributes=True)
