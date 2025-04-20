from pydantic import BaseModel


class MaritalStatusBase(BaseModel):
    marital_status_name: str


class MaritalStatusCreate(MaritalStatusBase):
    pass


class MaritalStatus(MaritalStatusBase):
    marital_status_id: int

    class Config:
        orm_mode = True
