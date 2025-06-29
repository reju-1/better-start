from typing import List
from pydantic import BaseModel


class TotalStats(BaseModel):
    total_projects: int
    total_sales: int
    total_employees: int


class MonthlySalesData(BaseModel):
    month: str
    total: float


class MonthlySalesResponse(BaseModel):
    data: List[MonthlySalesData]


class MonthlyTargetOverview(BaseModel):
    monthly_target: int
    total_sales_this_month: float
    total_sales_today: float
