from .age import AgeReport
from .gender import GenderReport
from .education import EducationReport

REPORTS = {
    "age": AgeReport,
    "gender": GenderReport,
    "education": EducationReport,
}

def get_report(report_type, session):
    cls = REPORTS.get(report_type)
    if not cls:
        raise ValueError("Unknown report type")
    return cls(session)
