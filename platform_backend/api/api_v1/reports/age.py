from .base import ReportBase
from core.models.employees.employee import Employee
from core.models.employees.department import Department
from core.models.employees.job_role import JobRole
from sqlalchemy import select

class AgeReport(ReportBase):
    async def get_stats(self):
        # Только неуволенные сотрудники
        base_query = select(Employee.age, Department.department_name, JobRole.job_role_name) \
            .join(Department, Employee.department_id == Department.department_id) \
            .join(JobRole, Employee.job_role_id == JobRole.job_role_id) \
            .where(Employee.attrition == False)
        result = await self.session.execute(base_query)
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

    def serialize(self, stats):
        return stats
