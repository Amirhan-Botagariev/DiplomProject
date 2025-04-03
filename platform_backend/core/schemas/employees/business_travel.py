from pydantic import BaseModel


class BusinessTravelBase(BaseModel):
    name: str


class BusinessTravelRead(BusinessTravelBase):
    id: int

    class Config:
        from_attributes = True
