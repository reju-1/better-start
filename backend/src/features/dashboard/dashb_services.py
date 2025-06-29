from datetime import datetime, date
from sqlalchemy import extract, func
from sqlmodel import Session, select
from src.models.project_models import Project
from src.models.sales_models import Sales
from src.models.company_models import CompanyMember, Company


def get_total_stats(session: Session, company_id: int) -> dict:
    total_projects = session.exec(
        select(func.count(Project.id)).where(Project.company_id == company_id)
    ).one()

    total_sales_count = session.exec(
        select(func.count(Sales.id)).where(Sales.company_id == company_id)
    ).one()

    total_employees = session.exec(
        select(func.count(CompanyMember.id)).where(CompanyMember.company_id == company_id)
    ).one()

    return {
        "total_projects": total_projects,
        "total_sales": total_sales_count,
        "total_employees": total_employees
    }


def get_monthly_sales(session: Session, company_id: int) -> list:
    current_year = datetime.today().year
    start_date = date(current_year, 1, 1)
    end_date = date(current_year, 12, 31)

    stmt = (
        select(
            extract("month", Sales.issue_date).label("month"),
            func.sum(Sales.quantity * Sales.unit_price).label("total")
        )
        .where(Sales.company_id == company_id)
        .where(Sales.issue_date.between(start_date, end_date))
        .group_by("month")
        .order_by("month")
    )
    results = session.exec(stmt).all()

    # Fill all 12 months
    month_map = {int(month): float(total or 0.0) for month, total in results}
    full_months = [
        {"month": datetime(2025, i, 1).strftime("%b"), "total": round(month_map.get(i, 0.0), 2)}
        for i in range(1, 13)
    ]

    return full_months


def get_monthly_target_overview(session: Session, company_id: int) -> dict:
    today = date.today()
    first_of_month = today.replace(day=1)

    # Get company info
    company = session.exec(
        select(Company).where(Company.id == company_id)
    ).first()
    monthly_target = company.monthly_target or 0

    # This month's total sales
    this_month_sales = session.exec(
        select(func.sum(Sales.quantity * Sales.unit_price))
        .where(Sales.company_id == company_id)
        .where(Sales.issue_date >= first_of_month)
    ).one() or 0.0

    # Today's sales
    today_sales = session.exec(
        select(func.sum(Sales.quantity * Sales.unit_price))
        .where(Sales.company_id == company_id)
        .where(Sales.issue_date == today)
    ).one() or 0.0

    return {
        "monthly_target": monthly_target,
        "total_sales_this_month": round(this_month_sales or 0.0, 2),
        "total_sales_today": round(today_sales or 0.0, 2)
    }
