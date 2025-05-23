from .base import ReportBase
from core.models.employees.employee import Employee
from core.models.employees.education_field import EducationField
from core.models.employees.department import Department
from core.models.employees.job_role import JobRole
from sqlalchemy import select

class EducationReport(ReportBase):
    async def get_stats(self):
        base_query = select(
            Employee.education_level,
            EducationField.education_field_name,
            Department.department_name,
            JobRole.job_role_name
        ).join(EducationField, Employee.education_field_id == EducationField.education_field_id, isouter=True)
        base_query = base_query.join(Department, Employee.department_id == Department.department_id, isouter=True)
        base_query = base_query.join(JobRole, Employee.job_role_id == JobRole.job_role_id, isouter=True)
        base_query = base_query.where(Employee.attrition == False)
        result = await self.session.execute(base_query)
        rows = result.fetchall()
        count = len(rows)
        level_counts = {}
        for level, _, _, _ in rows:
            level_counts[level] = level_counts.get(level, 0) + 1
        field_counts = {}
        for _, field, _, _ in rows:
            field_counts[field] = field_counts.get(field, 0) + 1
        field_by_dep = {}
        for _, field, dep, _ in rows:
            field_by_dep.setdefault(dep, {}).setdefault(field, 0)
            field_by_dep[dep][field] += 1
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

    def serialize(self, stats):
        return stats
