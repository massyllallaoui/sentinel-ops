from pydantic import BaseModel, HttpUrl
from typing import Optional

class UserCreate(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class MonitorCreate(BaseModel):
    name: str
    target_url: str
    check_interval_seconds: Optional[int] = 60

class Token(BaseModel):
    access_token: str
    token_type: str
