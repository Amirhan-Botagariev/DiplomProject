from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from core.models.db_helper import db_helper
from core.models.employees.attrition_prediction import AttritionPrediction
from core.models.employees.employee import Employee
from core.models.employees.department import Department
from core.models.employees.job_role import JobRole
from core.models.employees.gender import Gender
from core.models.employees.education_field import EducationField
from core.models.employees.marital_status import MaritalStatus
from core.models.employees.business_travel import BusinessTravel

router = APIRouter()

# Финальный вариант get_session для FastAPI Depends
async def get_session():
    async with db_helper.session_getter() as session:
        yield session

@router.get("/attrition_risk")
async def get_attrition_risk(session: AsyncSession = Depends(get_session)):
    stmt = (
        select(
            AttritionPrediction.employee_number,
            AttritionPrediction.predicted_attrition_prob,
            Employee.employee_id,
            Employee.department_id,
            Employee.job_role_id,
            Employee.age,
            Employee.training_times_last_year,
            Employee.years_at_company,
            Employee.years_in_current_role,
            Employee.work_life_balance,
            Employee.num_companies_worked,
            Employee.total_working_years,
            Employee.job_level,
            Employee.attrition,
            Employee.education_level,
            Employee.years_since_last_promotion,
            Employee.years_with_curr_manager,
            Department.department_name,
            JobRole.job_role_name,
            Employee,
            Gender.gender_name,
            EducationField.education_field_name,
            MaritalStatus.marital_status_name,
            BusinessTravel.travel_type
        )
        .join(Employee, Employee.employee_number == AttritionPrediction.employee_number)
        .join(Department, Employee.department_id == Department.department_id)
        .join(JobRole, Employee.job_role_id == JobRole.job_role_id)
        .outerjoin(Gender, Employee.gender_id == Gender.gender_id)
        .outerjoin(EducationField, Employee.education_field_id == EducationField.education_field_id)
        .outerjoin(MaritalStatus, Employee.marital_status_id == MaritalStatus.marital_status_id)
        .outerjoin(BusinessTravel, Employee.business_travel_id == BusinessTravel.business_travel_id)
    )
    result = await session.execute(stmt)
    rows = result.unique().all()
    notifications = []
    for row in rows:
        emp = row.Employee
        notifications.append({
            "id": emp.employee_id,
            "name": getattr(emp, "full_name", f"Сотрудник {emp.employee_number}"),
            "position": getattr(row, "job_role_name", None),
            "department": getattr(row, "department_name", None),
            "risk": float(row.predicted_attrition_prob),
            "reason": "Автоматически определено моделью",
            "gender": getattr(row, "gender_name", None),
            "age": emp.age,
            "years_at_company": emp.years_at_company,
            "years_in_current_role": emp.years_in_current_role,
            "work_life_balance": emp.work_life_balance,
            "num_companies_worked": emp.num_companies_worked,
            "total_working_years": emp.total_working_years,
            "job_level": emp.job_level,
            "attrition": emp.attrition,
            "training_times_last_year": emp.training_times_last_year,
            "education_level": emp.education_level,
            "education_field": getattr(row, "education_field_name", None),
            "marital_status": getattr(row, "marital_status_name", None),
            "business_travel": getattr(row, "travel_type", None),
            "years_since_last_promotion": emp.years_since_last_promotion,
            "years_with_curr_manager": emp.years_with_curr_manager,
        })
    notifications.sort(key=lambda x: x["risk"], reverse=True)
    return notifications