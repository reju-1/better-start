from fastapi import APIRouter, UploadFile, File
import pandas as pd
from io import StringIO
from src.features.csv_analyzer.models.analysis import analyze_csv

router = APIRouter()

@router.post("/csv")
async def upload_csv(file: UploadFile = File(...)):
    contents = await file.read()
    df = pd.read_csv(StringIO(contents.decode("utf-8")))
    analysis_result = analyze_csv(df)
    return analysis_result  # <-- flatten the response
