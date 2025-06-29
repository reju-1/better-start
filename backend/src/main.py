from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core import init_db, settings
import src.models  # Temporary: For creating Tables

# Router imports
from src import features
from src.features.dashboard import dashb_routers   # Add this import
from src.features.kanban import project_router, task_router  # Add this import
from src.features.sales import sales_router  # Import the sales router
from src.features.ai_tools.gemini_router import router as gemini_router  # Import the Gemini router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup operations
    init_db()
    yield
    # Shutdown operations (if any)


app = FastAPI(
    title="Better-Start",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def get_root():
    """Health Route"""
    return {"Message": "Welcome To BetterStart"}


# Include the routers
app.include_router(features.user_router, prefix="/api", tags=["User"])
app.include_router(features.company_router, prefix="/api", tags=["Company"])

app.include_router(dashb_routers.router, prefix="/api", tags=["Dashboard"])

app.include_router(features.hr_router, prefix="/api", tags=["HR"])

app.include_router(project_router, prefix="/api/project", tags=["Project"]) 
app.include_router(task_router, prefix="/api/kanban", tags=["Project➜Kanban"])
  
app.include_router(sales_router, prefix="/api/sales", tags=["Sales"])  

app.include_router(gemini_router, prefix="/ai_tools/document", tags=["Gemini"])
