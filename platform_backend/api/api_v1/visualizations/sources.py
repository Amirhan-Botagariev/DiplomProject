from fastapi import APIRouter, HTTPException
from typing import List

from core.repositories.visualizations.sources_repository import (
    PredefinedSourceRepository,
)
from core.schemas.visualizations.sources import (
    PredefinedSourceShort,
    PredefinedSourceDetail,
)

router = APIRouter()


@router.get("/predefined", response_model=List[PredefinedSourceShort])
async def get_all_predefined_sources():
    sources = await PredefinedSourceRepository.get_all()
    return [
        PredefinedSourceShort(
            id=source.id,
            name=source.name,
            description=source.description,
            chart_type=source.chart_type,
        )
        for source in sources
    ]


@router.get("/predefined/{source_id}", response_model=PredefinedSourceDetail)
async def get_predefined_source(source_id: int):
    source = await PredefinedSourceRepository.get_by_id(source_id)
    if not source:
        raise HTTPException(status_code=404, detail="Source not found")

    return PredefinedSourceDetail(
        id=source.id,
        name=source.name,
        description=source.description,
        query=source.query,
        available_filters=source.available_filters,
        chart_type=source.chart_type,
    )
