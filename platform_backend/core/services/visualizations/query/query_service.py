from sqlalchemy import text

from core.models.db_helper import db_helper
from core.repositories.visualizations.cache_repository import QueryCacheRepository
from core.repositories.visualizations.query_history_repository import (
    QueryHistoryRepository,
)
from core.repositories.visualizations.sources_repository import (
    PredefinedSourceRepository,
)
from core.services.visualizations.query.query_builder_service import QueryBuilderService


class QueryService:

    @staticmethod
    async def execute_predefined(source_id: int, filters: dict):
        source = await PredefinedSourceRepository.get_by_id(source_id)
        if not source:
            raise Exception("Источник данных не найден")

        final_sql = QueryBuilderService.render_query(source.query, filters or {})

        cache_result = await QueryCacheRepository.get_cache(final_sql)
        if cache_result:
            return cache_result, source.chart_type

        async with db_helper.session_getter() as session:
            result = await session.execute(text(final_sql))
            rows = result.mappings().all()

        await QueryCacheRepository.set_cache(final_sql, rows)

        await QueryHistoryRepository.save_history(
            source_type="predefined",
            source_id=source_id,
            executed_query=final_sql,
            rows_returned=len(rows),
        )

        return rows, source.chart_type
