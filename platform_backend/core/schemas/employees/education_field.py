from pydantic import BaseModel


class EducationFieldBase(BaseModel):
    name: str


class EducationFieldCreate(EducationFieldBase):
    pass


class EducationField(EducationFieldBase):
    id: int

    class Config:
        orm_mode = True
