from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, TYPE_CHECKING
from datetime import date
from src.enums import SalesStatus

if TYPE_CHECKING:
    from src.models.company_models import Company


class Sales(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    company_id: int = Field(foreign_key="company.id")
    invoice_number: str
    customer_name: str
    customer_number: str
    customer_email: str
    product_description: str
    quantity: int
    unit_price: float
    issue_date: date = Field(default_factory=date.today)
    status: SalesStatus = Field(default=SalesStatus.PENDING)
    due_date: Optional[date] = None

    company: Optional["Company"] = Relationship(back_populates="sales")