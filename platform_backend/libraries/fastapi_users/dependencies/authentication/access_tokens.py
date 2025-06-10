from fastapi_users_db_sqlalchemy.access_token import SQLAlchemyAccessTokenDatabase
from core.models import db_helper, AccessToken


async def get_access_tokens_db():
    async with db_helper.session_getter() as session:
        yield SQLAlchemyAccessTokenDatabase(session, AccessToken)
