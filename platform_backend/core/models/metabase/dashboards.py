from sqlalchemy import Column, Integer, String, DateTime, JSON

from ..base import Base


class Dashboard(Base):
    __tablename__ = "dashboards"

    dashboard_id = Column(Integer, primary_key=True)
    dashboard_name = Column(String, nullable=False, index=True)
    dashboard_url = Column(String(500), nullable=True)

    creator_id = Column(Integer, index=True)
    creator_name = Column(String)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)
    # access_user_ids = Column(ARRAY(Integer), index=True, nullable=True)
    # access_groups = Column(ARRAY(ENUM(AccessGroupRole)), index=True, nullable=True) #TODO: Добавить права доступа
    category = Column(String(100), nullable=True, index=True)
    tags = Column(JSON, nullable=True)
