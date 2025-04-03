from pydantic import BaseModel


class MaritalStatusBase(BaseModel):
    name: str


class MaritalStatusCreate(MaritalStatusBase):
    pass


class MaritalStatus(MaritalStatusBase):
    id: int

    class Config:
        orm_mode = True
