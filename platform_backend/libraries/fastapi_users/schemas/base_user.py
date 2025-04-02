from typing import Any, Generic, Optional, TypeVar

from pydantic import BaseModel, ConfigDict, Field
from pydantic.version import VERSION as PYDANTIC_VERSION

from fastapi_users import models

UserIdType = TypeVar("UserIdType")

PYDANTIC_V2 = PYDANTIC_VERSION.startswith("2.")

SCHEMA = TypeVar("SCHEMA", bound=BaseModel)

if PYDANTIC_V2:  # pragma: no cover

    def model_dump(model: BaseModel, *args, **kwargs) -> dict[str, Any]:
        return model.model_dump(*args, **kwargs)  # type: ignore

    def model_validate(schema: type[SCHEMA], obj: Any, *args, **kwargs) -> SCHEMA:
        return schema.model_validate(obj, *args, **kwargs)  # type: ignore

else:  # pragma: no cover  # type: ignore

    def model_dump(model: BaseModel, *args, **kwargs) -> dict[str, Any]:
        return model.dict(*args, **kwargs)  # type: ignore

    def model_validate(schema: type[SCHEMA], obj: Any, *args, **kwargs) -> SCHEMA:
        return schema.from_orm(obj)  # type: ignore


class CreateUpdateDictModel(BaseModel):
    def create_update_dict(self):
        return model_dump(
            self,
            exclude_unset=True,
            exclude={
                "id",
                "is_superuser",
                "is_active",
                "is_verified",
                "oauth_accounts",
            },
        )

    def create_update_dict_superuser(self):
        return model_dump(self, exclude_unset=True, exclude={"id"})


class BaseUser(CreateUpdateDictModel, Generic[UserIdType]):
    """Base User model."""

    id: models.ID
    iin: str = Field(..., pattern=r"^\d{12}$")
    is_active: bool = True
    is_superuser: bool = False
    is_verified: bool = False

    if PYDANTIC_V2:  # pragma: no cover
        model_config = ConfigDict(from_attributes=True)  # type: ignore
    else:  # pragma: no cover

        class Config:
            orm_mode = True


class BaseUserCreate(CreateUpdateDictModel):
    iin: str = Field(..., pattern=r"^\d{12}$")
    password: str
    is_active: Optional[bool] = True
    is_superuser: Optional[bool] = False
    is_verified: Optional[bool] = False


class BaseUserUpdate(CreateUpdateDictModel):
    password: Optional[str] = None
    iin: Optional[str] = Field(default=None, pattern=r"^\d{12}$")
    is_active: Optional[bool] = None
    is_superuser: Optional[bool] = None
    is_verified: Optional[bool] = None


U = TypeVar("U", bound=BaseUser)
UC = TypeVar("UC", bound=BaseUserCreate)
UU = TypeVar("UU", bound=BaseUserUpdate)


class BaseOAuthAccount(BaseModel, Generic[UserIdType]):
    id: models.ID
    oauth_name: str
    access_token: str
    expires_at: Optional[int] = None
    refresh_token: Optional[str] = None
    account_id: str
    account_iin: str

    if PYDANTIC_V2:  # pragma: no cover
        model_config = ConfigDict(from_attributes=True)  # type: ignore
    else:  # pragma: no cover

        class Config:
            orm_mode = True


class BaseOAuthAccountMixin(BaseModel):
    oauth_accounts: list[BaseOAuthAccount] = []
