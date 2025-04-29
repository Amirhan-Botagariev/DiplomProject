from core.models.visualizations.query_history import QueryHistory
from core.models.db_helper import db_helper
from datetime import datetime, timezone

class QueryHistoryRepository:

    @staticmethod
    async def save_history(
        source_type: str,
        source_id: int,
        executed_query: str,
        rows_returned: int,
        error_message: str = None,
        duration_ms: float = None,
        user_id: int = None,
    ):
        async with db_helper.session_getter() as session:
            history_entry = QueryHistory(
                user_id=user_id,
                source_type=source_type,
                source_id=source_id,
                executed_query=executed_query,
                executed_at=datetime.now(timezone.utc),
                duration_ms=duration_ms,
                rows_returned=rows_returned,
                error_message=error_message
            )
            session.add(history_entry)
            await session.commit()
