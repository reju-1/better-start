from fastapi import APIRouter, Depends
from sqlmodel import Session
from src.core.db import get_session
from src.security import oauth2
from src.schemas import Message, TokenData
from src.models.user_models import User
from src.features.dashboard import dashb_services as services
from src.features.dashboard import dashb_schemas as schemas
from typing import Annotated

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])
DBSession = Annotated[Session, Depends(get_session)]


@router.get("/totals", response_model=schemas.TotalStats)
def get_totals(
    db: Session = Depends(get_session),
    user: User = Depends(oauth2.get_current_user)
):
    return services.get_total_stats(db, company_id=user.company_id)


@router.get("/monthly-sales", response_model=schemas.MonthlySalesResponse)
def get_monthly_sales(
    db: Session = Depends(get_session),
    user: User = Depends(oauth2.get_current_user)
):
    return {"data": services.get_monthly_sales(db, user.company_id)}


@router.get("/monthly-target", response_model=schemas.MonthlyTargetOverview)
def get_target_stats(
    db: Session = Depends(get_session),
    user: User = Depends(oauth2.get_current_user)
):
    return services.get_monthly_target_overview(db, user.company_id)
