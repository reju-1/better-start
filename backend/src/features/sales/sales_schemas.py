from datetime import date
from typing import Optional
from sqlmodel import SQLModel
from src.enums import SalesStatus

class SalesBase(SQLModel):
    """Base fields for a sale."""
    invoice_number: str
    customer_name: str
    product_description: str
    quantity: int
    unit_price: float
    issue_date: date
    due_date: Optional[date] = None
    status: SalesStatus = SalesStatus.PENDING

class SalesCreate(SalesBase):
    """Fields required to create a sale."""
    pass

class SalesUpdate(SQLModel):
    """Fields that can be updated for a sale."""
    invoice_number: Optional[str] = None
    customer_name: Optional[str] = None
    product_description: Optional[str] = None
    quantity: Optional[int] = None
    unit_price: Optional[float] = None
    issue_date: Optional[date] = None
    due_date: Optional[date] = None
    status: SalesStatus = SalesStatus.PENDING

class SalesOut(SalesBase):
    """Fields returned in sale responses."""
    id: int
    company_id: int
    status: SalesStatus = SalesStatus.PENDING

    class Config:
        orm_mode = True