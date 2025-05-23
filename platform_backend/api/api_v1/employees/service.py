from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, asc, desc
from core.models.employees.employee import Employee
from core.models.employees.department import Department
from core.models.employees.job_role import JobRole
from core.models.employees.gender import Gender
from core.models.employees.education_field import EducationField
from core.models.employees.marital_status import MaritalStatus
from core.models.employees.business_travel import BusinessTravel
from core.models.employees.performance_review import PerformanceReview
from core.models.employees.attrition_prediction import AttritionPrediction
from .schemas import EmployeeOut, EmployeeListResponse

class EmployeeService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_employees(self, filters: dict, skip: int, limit: int, sort_by: str, sort_order: str) -> EmployeeListResponse:
        stmt = self._base_query()
        stmt = self._apply_filters(stmt, filters)
        stmt = self._apply_sort(stmt, sort_by, sort_order)
        stmt = stmt.offset(skip).limit(limit)
        result = await self.session.execute(stmt)
        employees = [self._row_to_employee_out(row) for row in result.fetchall()]
        total = await self._count_total(filters)
        return EmployeeListResponse(employees=employees, total=total)

    async def get_attrition_notifications(self):
        stmt = self._base_query()
        result = await self.session.execute(stmt)
        rows = result.unique().all()
        notifications = [self._row_to_notification(row) for row in rows]
        notifications.sort(key=lambda x: x["risk"] or 0, reverse=True)
        return notifications

    def _base_query(self):
        return select(
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
        ).join(Department, Employee.department_id == Department.department_id, isouter=True
        ).join(JobRole, Employee.job_role_id == JobRole.job_role_id, isouter=True
        ).join(Gender, Employee.gender_id == Gender.gender_id, isouter=True
        ).join(EducationField, Employee.education_field_id == EducationField.education_field_id, isouter=True
        ).join(MaritalStatus, Employee.marital_status_id == MaritalStatus.marital_status_id, isouter=True
        ).join(BusinessTravel, Employee.business_travel_id == BusinessTravel.business_travel_id, isouter=True
        ).join(PerformanceReview, Employee.employee_id == PerformanceReview.employee_id, isouter=True
        ).join(AttritionPrediction, Employee.employee_number == AttritionPrediction.employee_number, isouter=True)

    def _apply_filters(self, stmt, filters):
        if filters.get('department'):
            stmt = stmt.where(Department.department_name == filters['department'])
        if filters.get('attrition') is not None:
            stmt = stmt.where(Employee.attrition == filters['attrition'])
        if filters.get('education_level') is not None:
            stmt = stmt.where(Employee.education_level == filters['education_level'])
        if filters.get('education_field'):
            stmt = stmt.where(EducationField.education_field_name == filters['education_field'])
        if filters.get('gender'):
            stmt = stmt.where(Gender.gender_name == filters['gender'])
        if filters.get('marital_status'):
            stmt = stmt.where(MaritalStatus.marital_status_name == filters['marital_status'])
        if filters.get('job_role'):
            stmt = stmt.where(JobRole.job_role_name == filters['job_role'])
        if filters.get('years_at_company_min') is not None:
            stmt = stmt.where(Employee.years_at_company >= filters['years_at_company_min'])
        if filters.get('years_at_company_max') is not None:
            stmt = stmt.where(Employee.years_at_company <= filters['years_at_company_max'])
        if filters.get('performance_rating') is not None:
            stmt = stmt.where(PerformanceReview.performance_rating == filters['performance_rating'])
        if filters.get('risk_min') is not None:
            stmt = stmt.where(AttritionPrediction.predicted_attrition_prob >= filters['risk_min'] / 100)
        if filters.get('risk_max') is not None:
            stmt = stmt.where(AttritionPrediction.predicted_attrition_prob <= filters['risk_max'] / 100)
        if filters.get('age_min') is not None:
            stmt = stmt.where(Employee.age >= filters['age_min'])
        if filters.get('age_max') is not None:
            stmt = stmt.where(Employee.age <= filters['age_max'])
        return stmt

    def _apply_sort(self, stmt, sort_by, sort_order):
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
        sort_column = sort_map.get(sort_by)
        if sort_column:
            stmt = stmt.order_by(asc(sort_column) if sort_order == "asc" else desc(sort_column))
        return stmt

    async def _count_total(self, filters):
        stmt = select(func.count()).select_from(Employee)
        stmt = stmt.join(Department, Employee.department_id == Department.department_id, isouter=True)
        stmt = stmt.join(JobRole, Employee.job_role_id == JobRole.job_role_id, isouter=True)
        stmt = stmt.join(Gender, Employee.gender_id == Gender.gender_id, isouter=True)
        stmt = stmt.join(EducationField, Employee.education_field_id == EducationField.education_field_id, isouter=True)
        stmt = stmt.join(MaritalStatus, Employee.marital_status_id == MaritalStatus.marital_status_id, isouter=True)
        stmt = stmt.join(BusinessTravel, Employee.business_travel_id == BusinessTravel.business_travel_id, isouter=True)
        stmt = stmt.join(PerformanceReview, Employee.employee_id == PerformanceReview.employee_id, isouter=True)
        stmt = stmt.join(AttritionPrediction, Employee.employee_number == AttritionPrediction.employee_number, isouter=True)
        stmt = self._apply_filters(stmt, filters)
        result = await self.session.execute(stmt)
        return result.scalar() or 0

    def _row_to_employee_out(self, row):
        d = dict(row._mapping)
        return EmployeeOut(
            employee_id=d.get("employee_id"),
            employee_number=str(d.get("employee_number")) if d.get("employee_number") is not None else None,
            full_name=None,
            age=d.get("age"),
            gender=d.get("gender_name"),
            marital_status=d.get("marital_status_name"),
            education_level=d.get("education_level"),
            education_field=d.get("education_field_name"),
            department=d.get("department_name"),
            job_role=d.get("job_role_name"),
            job_level=d.get("job_level"),
            attrition=d.get("attrition"),
            business_travel=d.get("travel_type"),
            num_companies_worked=d.get("num_companies_worked"),
            total_working_years=d.get("total_working_years"),
            years_at_company=d.get("years_at_company"),
            years_in_current_role=d.get("years_in_current_role"),
            years_since_last_promotion=d.get("years_since_last_promotion"),
            years_with_curr_manager=d.get("years_with_curr_manager"),
            work_life_balance=d.get("work_life_balance"),
            training_times_last_year=d.get("training_times_last_year"),
            performance_rating=d.get("performance_rating"),
            job_involvement=d.get("job_involvement"),
            job_satisfaction=d.get("job_satisfaction"),
            relationship_satisfaction=d.get("relationship_satisfaction"),
            environment_satisfaction=d.get("environment_satisfaction"),
            review_date=str(d.get("review_date")) if d.get("review_date") else None,
            risk=float(d["predicted_attrition_prob"]) if d.get("predicted_attrition_prob") is not None else None,
            created_at=str(d.get("created_at")) if d.get("created_at") else None,
            updated_at=str(d.get("updated_at")) if d.get("updated_at") else None,
        )

    def _row_to_notification(self, row):
        d = dict(row._mapping)
        return {
            "id": d.get("employee_id"),
            "name": f"Сотрудник {d.get('employee_number')}",
            "position": d.get("job_role_name"),
            "department": d.get("department_name"),
            "risk": float(d.get("predicted_attrition_prob") or 0) if d.get("predicted_attrition_prob") is not None else None,
            "gender": d.get("gender_name"),
            "age": d.get("age"),
            "years_at_company": d.get("years_at_company"),
            "years_in_current_role": d.get("years_in_current_role"),
            "work_life_balance": d.get("work_life_balance"),
            "num_companies_worked": d.get("num_companies_worked"),
            "total_working_years": d.get("total_working_years"),
            "job_level": d.get("job_level"),
            "attrition": d.get("attrition"),
            "training_times_last_year": d.get("training_times_last_year"),
            "education_level": d.get("education_level"),
            "education_field": d.get("education_field_name"),
            "marital_status": d.get("marital_status_name"),
            "business_travel": d.get("travel_type"),
            "years_since_last_promotion": d.get("years_since_last_promotion"),
            "years_with_curr_manager": d.get("years_with_curr_manager"),
        }
