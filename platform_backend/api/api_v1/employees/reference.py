from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from core.models.db_helper import db_helper
from core.models.session_dep import get_session
from .service import EmployeeService

router = APIRouter()

@router.get("/departments", summary="Get all department names")
async def get_departments(session: AsyncSession = Depends(get_session)):
    result = await session.execute(text("SELECT department_name FROM departments ORDER BY department_name"))
    return [row[0] for row in result.fetchall() if row[0]]

@router.get("/job_roles", summary="Get all job role names")
async def get_job_roles(session: AsyncSession = Depends(get_session)):
    result = await session.execute(text("SELECT job_role_name FROM job_roles ORDER BY job_role_name"))
    return [row[0] for row in result.fetchall() if row[0]]

@router.get("/education_fields", summary="Get all education field names")
async def get_education_fields(session: AsyncSession = Depends(get_session)):
    result = await session.execute(text("SELECT education_field_name FROM education_fields ORDER BY education_field_name"))
    return [row[0] for row in result.fetchall() if row[0]]

@router.get("/genders", summary="Get all gender names")
async def get_genders(session: AsyncSession = Depends(get_session)):
    result = await session.execute(text("SELECT gender_name FROM genders ORDER BY gender_name"))
    return [row[0] for row in result.fetchall() if row[0]]

@router.get("/marital_statuses", summary="Get all marital status names")
async def get_marital_statuses(session: AsyncSession = Depends(get_session)):
    result = await session.execute(text("SELECT marital_status_name FROM marital_statuses ORDER BY marital_status_name"))
    return [row[0] for row in result.fetchall() if row[0]]
