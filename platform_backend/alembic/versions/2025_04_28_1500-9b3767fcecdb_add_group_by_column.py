"""Add group_by column

Revision ID: 9b3767fcecdb
Revises: 33c38dc5ed2e
Create Date: 2025-04-28 15:00:40.212160

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "9b3767fcecdb"
down_revision: Union[str, None] = "33c38dc5ed2e"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column(
        "predefined_sources", sa.Column("group_by", sa.String(), nullable=True)
    )


def downgrade():
    op.drop_column("predefined_sources", "group_by")
