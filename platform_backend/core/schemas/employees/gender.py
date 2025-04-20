from pydantic import BaseModel


class GenderBase(BaseModel):
    gender_name: str


class GenderCreate(GenderBase):
    pass


class Gender(GenderBase):
    gender_id: int

    class Config:
        orm_mode = True
