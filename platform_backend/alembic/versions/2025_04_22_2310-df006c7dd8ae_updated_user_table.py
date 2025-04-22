"""Updated user table

Revision ID: df006c7dd8ae
Revises: 399f32e1e9a9
Create Date: 2025-04-22 23:10:54.181065

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "df006c7dd8ae"
down_revision: Union[str, None] = "399f32e1e9a9"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

user_role_enum = sa.Enum("admin", "analyst", "hr", name="userrole")


def upgrade() -> None:
    user_role_enum.create(op.get_bind(), checkfirst=True)
    op.add_column(
        "users", sa.Column("role", user_role_enum, nullable=False, server_default="hr")
    )


def downgrade() -> None:
    op.drop_column("users", "role")
    user_role_enum.drop(op.get_bind(), checkfirst=True)
