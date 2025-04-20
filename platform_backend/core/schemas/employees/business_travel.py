from pydantic import BaseModel


class BusinessTravelBase(BaseModel):
    travel_type: str


class BusinessTravelRead(BusinessTravelBase):
    business_travel_id: int

    class Config:
        orm_mode = True
