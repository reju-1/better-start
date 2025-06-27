from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import date
from src.enums import SalesStatus

class Sales(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    company_id: int = Field(foreign_key="company.id")
    invoice_number: str
    customer_name: str
    product_description: str
    quantity: int
    unit_price: float
    issue_date: date = Field(default_factory=date.today)
    status: SalesStatus = Field(default=SalesStatus.PENDING)
    due_date: Optional[date] = None