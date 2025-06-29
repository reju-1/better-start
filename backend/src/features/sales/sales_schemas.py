from datetime import date
from typing import Optional
from sqlmodel import SQLModel
from src.enums import SalesStatus

class CompanyInfo(SQLModel):
    name: str
    location: str
    logo_url: Optional[str]
    website_url: Optional[str]

    class Config:
        orm_mode = True

class SalesBase(SQLModel):
    """Base fields for a sale."""
    invoice_number: str
    customer_name: str
    customer_number: str  # <-- Add this line
    customer_email: str   # <-- Add this line
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
    customer_number: Optional[str] = None  # <-- Add this line
    customer_email: Optional[str] = None   # <-- Add this line
    product_description: Optional[str] = None
    quantity: Optional[int] = None
    unit_price: Optional[float] = None
    issue_date: Optional[date] = None
    due_date: Optional[date] = None
    status: SalesStatus = SalesStatus.PENDING

class SalesOut(SalesBase):
    """Fields returned in sale responses."""
    id: int
    company: Optional[CompanyInfo]  # <-- THIS LINE is required!

    status: SalesStatus = SalesStatus.PENDING

    class Config:
        orm_mode = True
        

