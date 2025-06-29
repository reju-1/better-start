from sqlmodel import Session, select
from sqlalchemy.orm import selectinload
from src.models.sales_models import Sales
from .sales_schemas import SalesCreate, SalesUpdate
from src.enums import SalesStatus
from src.models.company_models import Company
from typing import List, Optional

def create_sale(db: Session, sale: SalesCreate, company_id: int):
    db_sale = Sales(**sale.dict(), company_id=company_id)
    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)
    return db_sale

def get_all_sales(db: Session, company_id: int):
    return db.query(Sales).filter(Sales.company_id == company_id).all()

def update_sale(db: Session, sale_id: int, sale_update: SalesUpdate, company_id: int):
    db_sale = get_sale(db, sale_id, company_id)
    if not db_sale:
        return None
    for key, value in sale_update.dict(exclude_unset=True).items():
        setattr(db_sale, key, value)
    db.commit()
    db.refresh(db_sale)
    return db_sale

def change_status(db: Session, sale_id: int, status: str, company_id: int):
    db_sale = get_sale(db, sale_id, company_id)
    if not db_sale:
        return None
    db_sale.status = status
    db.commit()
    db.refresh(db_sale)
    return db_sale

def get_sale(session: Session, sale_id: int, company_id: Optional[int] = None):
    statement = (
        select(Sales)
        .where(Sales.id == sale_id)
        .options(selectinload(Sales.company))  # <-- important!
    )
    result = session.exec(statement).first()
    return result