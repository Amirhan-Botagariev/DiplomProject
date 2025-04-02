from typing import Protocol, TypeVar, Optional
from uuid import UUID

ID = TypeVar("ID")


class UserProtocol(Protocol[ID]):
    id: ID
    iin: str
    hashed_password: str
    is_active: bool
    is_superuser: bool
    is_verified: bool


class OAuthAccountProtocol(Protocol):
    id: UUID
    oauth_name: str
    access_token: str
    expires_at: Optional[int]
    refresh_token: Optional[str]
    account_id: str
    account_iin: str
