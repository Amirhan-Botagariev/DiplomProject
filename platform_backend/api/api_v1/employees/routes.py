from fastapi import APIRouter, Depends, Query
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc, asc, text, func
from core.models.db_helper import db_helper
from core.models.employees.employee import Employee
from core.models.employees.department import Department
from core.models.employees.job_role import JobRole
from core.models.employees.gender import Gender
from core.models.employees.education_field import EducationField
from core.models.employees.marital_status import MaritalStatus
from core.models.employees.business_travel import BusinessTravel
from core.models.employees.performance_review import PerformanceReview
from core.models.employees.attrition_prediction import AttritionPrediction

router = APIRouter()

async def get_session():
    async with db_helper.session_getter() as session:
        yield session

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from core.models import Department, JobRole, EducationField, Gender, MaritalStatus

@router.get("/departments/")
async def get_departments(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Department.department_name).order_by(Department.department_name))
    return [row[0] for row in result.fetchall() if row[0]]

@router.get("/job_roles/")
async def get_job_roles(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(JobRole.job_role_name).order_by(JobRole.job_role_name))
    return [row[0] for row in result.fetchall() if row[0]]

@router.get("/education_fields/")
async def get_education_fields(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(EducationField.education_field_name).order_by(EducationField.education_field_name))
    return [row[0] for row in result.fetchall() if row[0]]

@router.get("/genders/")
async def get_genders(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Gender.gender_name).order_by(Gender.gender_name))
    return [row[0] for row in result.fetchall() if row[0]]

@router.get("/marital_statuses/")
async def get_marital_statuses(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(MaritalStatus.marital_status_name).order_by(MaritalStatus.marital_status_name))
    return [row[0] for row in result.fetchall() if row[0]]

@router.get("/")
async def get_employees(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    sort_by: Optional[str] = Query(None, description="Field to sort by"),
    sort_order: Optional[str] = Query("asc", regex="^(asc|desc)$", description="Sort order: asc or desc"),
    department: Optional[str] = Query(None),
    attrition: Optional[bool] = Query(None),
    education_level: Optional[int] = Query(None),
    education_field: Optional[str] = Query(None),
    gender: Optional[str] = Query(None),
    marital_status: Optional[str] = Query(None),
    job_role: Optional[str] = Query(None),
    years_at_company_min: Optional[int] = Query(None),
    years_at_company_max: Optional[int] = Query(None),
    performance_rating: Optional[int] = Query(None),
    risk_min: Optional[float] = Query(None),
    risk_max: Optional[float] = Query(None),
    age_min: Optional[int] = Query(None),
    age_max: Optional[int] = Query(None),
    session: AsyncSession = Depends(get_session)
):
    stmt = (
        select(
            Employee.employee_id,
            Employee.employee_number,
            Employee.age,
            Employee.gender_id,
            Employee.marital_status_id,
            Employee.education_level,
            Employee.education_field_id,
            Employee.department_id,
            Employee.job_role_id,
            Employee.job_level,
            Employee.attrition,
            Employee.business_travel_id,
            Employee.num_companies_worked,
            Employee.total_working_years,
            Employee.years_at_company,
            Employee.years_in_current_role,
            Employee.years_since_last_promotion,
            Employee.years_with_curr_manager,
            Employee.work_life_balance,
            Employee.training_times_last_year,
            Employee.created_at,
            Employee.updated_at,
            Department.department_name,
            JobRole.job_role_name,
            Gender.gender_name,
            EducationField.education_field_name,
            MaritalStatus.marital_status_name,
            BusinessTravel.travel_type,
            PerformanceReview.performance_rating,
            PerformanceReview.job_involvement,
            PerformanceReview.job_satisfaction,
            PerformanceReview.relationship_satisfaction,
            PerformanceReview.environment_satisfaction,
            PerformanceReview.review_date,
            AttritionPrediction.predicted_attrition_prob
        )
        .join(Department, Employee.department_id == Department.department_id, isouter=True)
        .join(JobRole, Employee.job_role_id == JobRole.job_role_id, isouter=True)
        .join(Gender, Employee.gender_id == Gender.gender_id, isouter=True)
        .join(EducationField, Employee.education_field_id == EducationField.education_field_id, isouter=True)
        .join(MaritalStatus, Employee.marital_status_id == MaritalStatus.marital_status_id, isouter=True)
        .join(BusinessTravel, Employee.business_travel_id == BusinessTravel.business_travel_id, isouter=True)
        .join(PerformanceReview, Employee.employee_id == PerformanceReview.employee_id, isouter=True)
        .join(AttritionPrediction, Employee.employee_number == AttritionPrediction.employee_number, isouter=True)
    )
    # --- Фильтрация ---
    if department:
        stmt = stmt.where(Department.department_name == department)
    if attrition is not None:
        stmt = stmt.where(Employee.attrition == attrition)
    if education_level is not None:
        stmt = stmt.where(Employee.education_level == education_level)
    if education_field:
        stmt = stmt.where(EducationField.education_field_name == education_field)
    if gender:
        stmt = stmt.where(Gender.gender_name == gender)
    if marital_status:
        stmt = stmt.where(MaritalStatus.marital_status_name == marital_status)
    if job_role:
        stmt = stmt.where(JobRole.job_role_name == job_role)
    if years_at_company_min is not None:
        stmt = stmt.where(Employee.years_at_company >= years_at_company_min)
    if years_at_company_max is not None:
        stmt = stmt.where(Employee.years_at_company <= years_at_company_max)
    if performance_rating is not None:
        stmt = stmt.where(PerformanceReview.performance_rating == performance_rating)
    if risk_min is not None:
        stmt = stmt.where(AttritionPrediction.predicted_attrition_prob >= risk_min / 100)
    if risk_max is not None:
        stmt = stmt.where(AttritionPrediction.predicted_attrition_prob <= risk_max / 100)
    if age_min is not None:
        stmt = stmt.where(Employee.age >= age_min)
    if age_max is not None:
        stmt = stmt.where(Employee.age <= age_max)
    # --- Подсчет total ---
    count_stmt = select(func.count()).select_from(Employee)
    count_stmt = count_stmt.join(Department, Employee.department_id == Department.department_id, isouter=True)
    count_stmt = count_stmt.join(JobRole, Employee.job_role_id == JobRole.job_role_id, isouter=True)
    count_stmt = count_stmt.join(Gender, Employee.gender_id == Gender.gender_id, isouter=True)
    count_stmt = count_stmt.join(EducationField, Employee.education_field_id == EducationField.education_field_id, isouter=True)
    count_stmt = count_stmt.join(MaritalStatus, Employee.marital_status_id == MaritalStatus.marital_status_id, isouter=True)
    count_stmt = count_stmt.join(BusinessTravel, Employee.business_travel_id == BusinessTravel.business_travel_id, isouter=True)
    count_stmt = count_stmt.join(PerformanceReview, Employee.employee_id == PerformanceReview.employee_id, isouter=True)
    count_stmt = count_stmt.join(AttritionPrediction, Employee.employee_number == AttritionPrediction.employee_number, isouter=True)
    # применить те же where-фильтры
    if department:
        count_stmt = count_stmt.where(Department.department_name == department)
    if attrition is not None:
        count_stmt = count_stmt.where(Employee.attrition == attrition)
    if education_level is not None:
        count_stmt = count_stmt.where(Employee.education_level == education_level)
    if education_field:
        count_stmt = count_stmt.where(EducationField.education_field_name == education_field)
    if gender:
        count_stmt = count_stmt.where(Gender.gender_name == gender)
    if marital_status:
        count_stmt = count_stmt.where(MaritalStatus.marital_status_name == marital_status)
    if job_role:
        count_stmt = count_stmt.where(JobRole.job_role_name == job_role)
    if years_at_company_min is not None:
        count_stmt = count_stmt.where(Employee.years_at_company >= years_at_company_min)
    if years_at_company_max is not None:
        count_stmt = count_stmt.where(Employee.years_at_company <= years_at_company_max)
    if performance_rating is not None:
        count_stmt = count_stmt.where(PerformanceReview.performance_rating == performance_rating)
    if risk_min is not None:
        count_stmt = count_stmt.where(AttritionPrediction.predicted_attrition_prob >= risk_min / 100)
    if risk_max is not None:
        count_stmt = count_stmt.where(AttritionPrediction.predicted_attrition_prob <= risk_max / 100)
    if age_min is not None:
        count_stmt = count_stmt.where(Employee.age >= age_min)
    if age_max is not None:
        count_stmt = count_stmt.where(Employee.age <= age_max)
    # --- Сортировка ---
    sort_map = {
        "age": Employee.age,
        "job_level": Employee.job_level,
        "years_at_company": Employee.years_at_company,
        "department": Department.department_name,
        "job_role": JobRole.job_role_name,
        "education_level": Employee.education_level,
        "performance_rating": PerformanceReview.performance_rating,
        "risk": AttritionPrediction.predicted_attrition_prob,
        "employee_id": Employee.employee_id,
    }
    if sort_by and sort_by in sort_map:
        sort_col = sort_map[sort_by]
        if sort_order == "desc":
            stmt = stmt.order_by(sort_col.desc())
        else:
            stmt = stmt.order_by(sort_col.asc())
    else:
        stmt = stmt.order_by(Employee.employee_id.asc())
    stmt = stmt.offset(skip).limit(limit)
    result = await session.execute(stmt)
    employees = []
    for row in result.fetchall():
        d = dict(row._mapping)
        employees.append({
            "employee_id": d.get("employee_id"),
            "employee_number": d.get("employee_number"),
            "age": d.get("age"),
            "gender_id": d.get("gender_id"),
            "marital_status_id": d.get("marital_status_id"),
            "education_level": d.get("education_level"),
            "education_field_id": d.get("education_field_id"),
            "department_id": d.get("department_id"),
            "job_role_id": d.get("job_role_id"),
            "job_level": d.get("job_level"),
            "attrition": d.get("attrition"),
            "business_travel_id": d.get("business_travel_id"),
            "num_companies_worked": d.get("num_companies_worked"),
            "total_working_years": d.get("total_working_years"),
            "years_at_company": d.get("years_at_company"),
            "years_in_current_role": d.get("years_in_current_role"),
            "years_since_last_promotion": d.get("years_since_last_promotion"),
            "years_with_curr_manager": d.get("years_with_curr_manager"),
            "work_life_balance": d.get("work_life_balance"),
            "training_times_last_year": d.get("training_times_last_year"),
            "created_at": d.get("created_at"),
            "updated_at": d.get("updated_at"),
            "department": d.get("department_name") or "",
            "job_role": d.get("job_role_name") or "",
            "gender": d.get("gender_name") or "",
            "education_field": d.get("education_field_name") or "",
            "marital_status": d.get("marital_status_name") or "",
            "business_travel": d.get("travel_type") or "",
            "performance_rating": d.get("performance_rating"),
            "job_involvement": d.get("job_involvement"),
            "job_satisfaction": d.get("job_satisfaction"),
            "relationship_satisfaction": d.get("relationship_satisfaction"),
            "environment_satisfaction": d.get("environment_satisfaction"),
            "review_date": d.get("review_date"),
            "risk": float(d["predicted_attrition_prob"]) * 100 if d.get("predicted_attrition_prob") is not None else None
        })
    total_result = await session.execute(count_stmt)
    total = total_result.scalar() or 0
    return {"employees": employees, "total": total}

@router.get("/age_stats/")
async def get_age_stats(session: AsyncSession = Depends(get_session)):
    # Только неуволенные сотрудники
    base_query = select(Employee.age, Department.department_name, JobRole.job_role_name).join(Department, Employee.department_id == Department.department_id).join(JobRole, Employee.job_role_id == JobRole.job_role_id).where(Employee.attrition == False)
    result = await session.execute(base_query)
    rows = result.fetchall()
    # 1. Средний возраст по департаментам
    dep_ages = {}
    for age, dep, _ in rows:
        dep_ages.setdefault(dep, []).append(age)
    avg_age_by_dep = {dep: round(sum(ages)/len(ages), 1) for dep, ages in dep_ages.items() if ages}
    # 2. Средний возраст по ролям
    role_ages = {}
    for age, _, role in rows:
        role_ages.setdefault(role, []).append(age)
    avg_age_by_role = {role: round(sum(ages)/len(ages), 1) for role, ages in role_ages.items() if ages}
    # 3. Группы по возрасту
    bins = [(0,25),(26,30),(31,35),(36,40),(41,200)]
    age_groups = {f"{b[0]}-{b[1]}":0 for b in bins}
    for age, _, _ in rows:
        for b in bins:
            if b[0] <= age <= b[1]:
                age_groups[f"{b[0]}-{b[1]}"] += 1
                break
    # 4. Boxplot по департаментам
    boxplot_by_dep = {dep: ages for dep, ages in dep_ages.items() if ages}
    # 5. Доля молодых (<30) по департаментам
    young_share = {}
    for dep, ages in dep_ages.items():
        if ages:
            young_share[dep] = round(100 * sum(1 for a in ages if a < 30) / len(ages), 1)
    return {
        "avg_age_by_dep": avg_age_by_dep,
        "avg_age_by_role": avg_age_by_role,
        "age_groups": age_groups,
        "boxplot_by_dep": boxplot_by_dep,
        "young_share": young_share
    }

@router.get("/gender_stats/")
async def get_gender_stats(session: AsyncSession = Depends(get_session)):
    base_query = select(Gender.gender_name, MaritalStatus.marital_status_name, Department.department_name).join(Employee, Employee.gender_id == Gender.gender_id).join(MaritalStatus, Employee.marital_status_id == MaritalStatus.marital_status_id).join(Department, Employee.department_id == Department.department_id).where(Employee.attrition == False)
    result = await session.execute(base_query)
    rows = result.fetchall()
    # Всего
    count = len(rows)
    # По полу
    gender_counts = {}
    for gender, _, _ in rows:
        gender_counts[gender] = gender_counts.get(gender, 0) + 1
    # По семейному положению
    marital_counts = {}
    for _, marital, _ in rows:
        marital_counts[marital] = marital_counts.get(marital, 0) + 1
    # Пол по департаментам
    gender_by_dep = {}
    for gender, _, dep in rows:
        gender_by_dep.setdefault(dep, {}).setdefault(gender, 0)
        gender_by_dep[dep][gender] += 1
    # Семейное положение по департаментам
    marital_by_dep = {}
    for _, marital, dep in rows:
        marital_by_dep.setdefault(dep, {}).setdefault(marital, 0)
        marital_by_dep[dep][marital] += 1
    # Стек по департаментам (пол + семейное)
    stacked = {}
    for gender, marital, dep in rows:
        stacked.setdefault(dep, {}).setdefault(gender, {}).setdefault(marital, 0)
        stacked[dep][gender][marital] += 1
    return {
        "count": count,
        "gender_counts": gender_counts,
        "marital_counts": marital_counts,
        "gender_by_dep": gender_by_dep,
        "marital_by_dep": marital_by_dep,
        "stacked": stacked
    }

@router.get("/education_stats/")
async def get_education_stats(session: AsyncSession = Depends(get_session)):
    # Только неуволенные сотрудники
    base_query = select(
        Employee.education_level,
        EducationField.education_field_name,
        Department.department_name,
        JobRole.job_role_name
    ).join(EducationField, Employee.education_field_id == EducationField.education_field_id, isouter=True)
    base_query = base_query.join(Department, Employee.department_id == Department.department_id, isouter=True)
    base_query = base_query.join(JobRole, Employee.job_role_id == JobRole.job_role_id, isouter=True)
    base_query = base_query.where(Employee.attrition == False)
    result = await session.execute(base_query)
    rows = result.fetchall()
    # Всего
    count = len(rows)
    # По уровню образования
    level_counts = {}
    for level, _, _, _ in rows:
        level_counts[level] = level_counts.get(level, 0) + 1
    # По полю образования
    field_counts = {}
    for _, field, _, _ in rows:
        field_counts[field] = field_counts.get(field, 0) + 1
    # Образование по департаментам
    field_by_dep = {}
    for _, field, dep, _ in rows:
        field_by_dep.setdefault(dep, {}).setdefault(field, 0)
        field_by_dep[dep][field] += 1
    # Образование по ролям
    field_by_role = {}
    for _, field, _, role in rows:
        field_by_role.setdefault(role, {}).setdefault(field, 0)
        field_by_role[role][field] += 1
    return {
        "count": count,
        "level_counts": level_counts,
        "field_counts": field_counts,
        "field_by_dep": field_by_dep,
        "field_by_role": field_by_role
    }
