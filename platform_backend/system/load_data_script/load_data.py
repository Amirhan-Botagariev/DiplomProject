import os
import asyncio
import sqlparse
from sqlalchemy import text
from core.models.db_helper import db_helper, logger
from core.config import settings


async def load_sql_from_file(file_path: str) -> None:
    """Загружает и выполняет SQL команды из файла построчно, безопасно."""
    if not os.path.exists(file_path):
        logger.error("Файл %s не найден.", file_path)
        return

    with open(file_path, "r", encoding="utf-8") as file:
        sql_script = file.read()

    statements = sqlparse.split(sql_script)

    async with db_helper.session_getter() as session:
        try:
            for stmt in statements:
                stmt_clean = stmt.strip()
                if stmt_clean:
                    await session.execute(text(stmt_clean))
            await session.commit()
            logger.info("Все SQL команды успешно выполнены.")
        except Exception as e:
            logger.error("Ошибка при выполнении SQL: %s", e)
            await session.rollback()


if __name__ == "__main__":
    asyncio.run(load_sql_from_file(settings.script_config.path_to_file))
