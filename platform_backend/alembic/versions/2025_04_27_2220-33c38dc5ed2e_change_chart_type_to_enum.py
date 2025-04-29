"""Change chart_type to Enum

Revision ID: 33c38dc5ed2e
Revises: 92d9bb2671cb
Create Date: 2025-04-27 22:20:10.330653

"""

from typing import Sequence, Union

import sqlalchemy as sa
import sqlalchemy.dialects.postgresql as pg
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "33c38dc5ed2e"
down_revision: Union[str, None] = "92d9bb2671cb"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    charttypeenum = pg.ENUM(
        "table",
        "bar",
        "line",
        "pie",
        "doughnut",
        "metric",
        "boxplot",
        "map",
        name="charttypeenum",
    )
    charttypeenum.create(op.get_bind())
    op.add_column(
        "predefined_sources", sa.Column("chart_type", charttypeenum, nullable=True)
    )


def downgrade():
    op.drop_column("predefined_sources", "chart_type")
    pg.ENUM(name="charttypeenum").drop(op.get_bind())
