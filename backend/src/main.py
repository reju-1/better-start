from fastapi import FastAPI
from contextlib import asynccontextmanager

from .core import init_db
import src.models  # Temporary: For creating Tables

# Router imports
from src import features
from src.features.kanban import project_router, task_router  # Add this import


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


@app.get("/")
def get_root():
    """Health Route"""
    return {"Message": "Welcome To BetterStart"}


# Include the routers
app.include_router(features.user_router, prefix="/api", tags=["User"])
app.include_router(features.company_router, prefix="/api", tags=["Company"])
app.include_router(features.hr_router, prefix="/api", tags=["HR"])
app.include_router(project_router, prefix="/api/kanban", tags=["Project"]) 
app.include_router(task_router, prefix="/api/kanban", tags=["Project➜Kanban"])  
