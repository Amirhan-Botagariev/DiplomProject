from .base import ReportBase
from core.models.employees.employee import Employee
from core.models.employees.gender import Gender
from core.models.employees.marital_status import MaritalStatus
from core.models.employees.department import Department
from sqlalchemy import select

class GenderReport(ReportBase):
    async def get_stats(self):
        base_query = select(Gender.gender_name, MaritalStatus.marital_status_name, Department.department_name) \
            .join(Employee, Employee.gender_id == Gender.gender_id) \
            .join(MaritalStatus, Employee.marital_status_id == MaritalStatus.marital_status_id) \
            .join(Department, Employee.department_id == Department.department_id) \
            .where(Employee.attrition == False)
        result = await self.session.execute(base_query)
        rows = result.fetchall()
        count = len(rows)
        gender_counts = {}
        for gender, _, _ in rows:
            gender_counts[gender] = gender_counts.get(gender, 0) + 1
        marital_counts = {}
        for _, marital, _ in rows:
            marital_counts[marital] = marital_counts.get(marital, 0) + 1
        gender_by_dep = {}
        for gender, _, dep in rows:
            gender_by_dep.setdefault(dep, {}).setdefault(gender, 0)
            gender_by_dep[dep][gender] += 1
        marital_by_dep = {}
        for _, marital, dep in rows:
            marital_by_dep.setdefault(dep, {}).setdefault(marital, 0)
            marital_by_dep[dep][marital] += 1
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

    def serialize(self, stats):
        return stats
