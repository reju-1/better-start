from fastapi import APIRouter

# Import the existing feature routers
from .user.user_router import router as user_router
from .company.company_router import router as company_router
from .hr_management.hr_router import router as hr_router
from .dashboard.dashb_routers import router as dashb_routers
from .kanban import project_router, task_router
from .sales import sales_router
from .ai_tools.gemini_router import router as gemini_router
from .csv_analyzer.routers.csv_router import router as eda_router


# Create a single master router and mount everything into it
router = APIRouter()


router.include_router(user_router, prefix="/api", tags=["User"])
router.include_router(company_router, prefix="/api", tags=["Company"])
router.include_router(dashb_routers, prefix="/api", tags=["Dashboard"])
router.include_router(hr_router, prefix="/api", tags=["HR"])

router.include_router(project_router, prefix="/api/project", tags=["Project"])
router.include_router(task_router, prefix="/api/kanban", tags=["Project➜Kanban"])

router.include_router(sales_router, prefix="/api/sales", tags=["Sales"])

router.include_router(gemini_router, prefix="/ai_tools/document", tags=["Extras"])
router.include_router(eda_router, prefix="/upload", tags=["Extras"])

# Export only the master router
__all__ = ["router"]
