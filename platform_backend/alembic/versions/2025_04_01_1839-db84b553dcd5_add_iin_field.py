"""add iin field

Revision ID: db84b553dcd5
Revises: 485f8652ee87
Create Date: 2025-04-01 18:39:22.698432

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "db84b553dcd5"
down_revision: Union[str, None] = "485f8652ee87"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Добавляем колонку как nullable
    op.add_column("users", sa.Column("iin", sa.String(length=12), nullable=True))

    op.execute("UPDATE users SET iin = '000000000000' WHERE iin IS NULL")

    # 3. Делаем колонку NOT NULL
    op.alter_column("users", "iin", nullable=False)

    # 4. Дропаем индекс по email
    op.drop_index("ix_users_email", table_name="users")

    # 5. Создаём индекс по iin
    op.create_index(op.f("ix_users_iin"), "users", ["iin"], unique=True)

    # 6. Удаляем колонку email
    op.drop_column("users", "email")


def downgrade() -> None:
    op.add_column(
        "users",
        sa.Column(
            "email",
            sa.VARCHAR(length=320),
            autoincrement=False,
            nullable=False,
        ),
    )
    op.drop_index(op.f("ix_users_iin"), table_name="users")
    op.create_index("ix_users_email", "users", ["email"], unique=True)
    op.drop_column("users", "iin")
