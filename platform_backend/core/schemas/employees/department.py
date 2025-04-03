# schemas/department.py
from pydantic import BaseModel


class DepartmentBase(BaseModel):
    department_name: str


class DepartmentCreate(DepartmentBase):
    pass


class DepartmentRead(DepartmentBase):
    department_id: int

    class Config:
        orm_mode = True
