from pydantic import BaseModel


class GenderBase(BaseModel):
    name: str


class GenderCreate(GenderBase):
    pass


class Gender(GenderBase):
    id: int

    class Config:
        orm_mode = True
