from pydantic import BaseModel


class EducationFieldBase(BaseModel):
    education_field_name: str


class EducationFieldCreate(EducationFieldBase):
    pass


class EducationField(EducationFieldBase):
    education_field_id: int

    class Config:
        orm_mode = True
