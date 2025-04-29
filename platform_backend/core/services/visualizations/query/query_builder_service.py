from typing import Dict

class QueryBuilderService:

    @staticmethod
    def render_query(template: str, filters: Dict[str, any]) -> str:
        sql = template
        for key, value in filters.items():
            safe_value = str(value).replace("'", "''")  # простая защита от SQL инъекций
            sql = sql.replace(f"{{{{{key}}}}}", f"'{safe_value}'")
        return sql