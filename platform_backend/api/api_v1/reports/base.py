from abc import ABC, abstractmethod
from sqlalchemy.ext.asyncio import AsyncSession

class ReportBase(ABC):
    def __init__(self, session: AsyncSession):
        self.session = session

    @abstractmethod
    async def get_stats(self):
        pass

    @abstractmethod
    def serialize(self, stats):
        pass
