# schemas/job_role.py
from pydantic import BaseModel


class JobRoleBase(BaseModel):
    job_role_name: str


class JobRoleCreate(JobRoleBase):
    pass


class JobRoleRead(JobRoleBase):
    job_role_id: int

    class Config:
        orm_mode = True
