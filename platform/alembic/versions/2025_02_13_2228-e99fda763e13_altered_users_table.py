"""altered users table

Revision ID: e99fda763e13
Revises: 21f24d0b87c8
Create Date: 2025-02-13 22:28:40.327946

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "e99fda763e13"
down_revision: Union[str, None] = "21f24d0b87c8"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "users", sa.Column("email", sa.String(length=320), nullable=False)
    )
    op.add_column(
        "users",
        sa.Column("hashed_password", sa.String(length=1024), nullable=False),
    )
    op.add_column(
        "users", sa.Column("is_active", sa.Boolean(), nullable=False)
    )
    op.add_column(
        "users", sa.Column("is_superuser", sa.Boolean(), nullable=False)
    )
    op.add_column(
        "users", sa.Column("is_verified", sa.Boolean(), nullable=False)
    )
    op.drop_constraint("uq_users_username", "users", type_="unique")
    op.create_index(op.f("ix_users_email"), "users", ["email"], unique=True)
    op.drop_column("users", "username")
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "users",
        sa.Column(
            "username", sa.VARCHAR(), autoincrement=False, nullable=False
        ),
    )
    op.drop_index(op.f("ix_users_email"), table_name="users")
    op.create_unique_constraint("uq_users_username", "users", ["username"])
    op.drop_column("users", "is_verified")
    op.drop_column("users", "is_superuser")
    op.drop_column("users", "is_active")
    op.drop_column("users", "hashed_password")
    op.drop_column("users", "email")
    # ### end Alembic commands ###
