from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime

class UserCreate(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: UUID
    email: str
    tier: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str

class MonitorCreate(BaseModel):
    name: str
    target_url: str
    check_interval_seconds: int = 60

class MonitorResponse(BaseModel):
    id: UUID
    name: str
    target_url: str
    is_active: bool
    model_config = ConfigDict(from_attributes=True)
