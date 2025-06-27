from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List
# from genai_config import model  # Ensure this import points to your model configuration
import os
import PyPDF2

from google import generativeai as genai

# Configure Gemini API Key
genai.configure(api_key="PLACE_YOUR_API_KEY")  # Replace with env variable in production

# Create and export model instance
model = genai.GenerativeModel(model_name="gemini-1.5-flash")



router = APIRouter(prefix="/gemini", tags=["Gemini"])

DATASETS_DIR = os.path.join(os.path.dirname(__file__), "datasets")
DATASET1 = "Bangladesh Corporate Document Proposals Dataset Creation.pdf"
DATASET2 = "Bangladesh Startup Document Dataset Creation.pdf"

class QueryRequest(BaseModel):
    message: List[str]

def extract_pdf_text(pdf_path):
    with open(pdf_path, "rb") as f:
        reader = PyPDF2.PdfReader(f)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
    return text

@router.post("/ask_document/")
async def ask_gemini_dataset1(request: QueryRequest):
    dataset_path = os.path.join(DATASETS_DIR, DATASET1)
    if not os.path.exists(dataset_path):
        raise HTTPException(status_code=400, detail="Dataset1 does not exist.")

    pdf_text = extract_pdf_text(dataset_path)
    system_prompt = (
        "You are an AI Legal Advisor and Facilitator. You answer all questions related to doing business in Bangladesh. "
        "You answer concisely and in detail using the PDF context. Provide links if possible. "
        "Focus on answering the LAST query while considering all previous queries and PDF context."
    )
    user_prompt = " | ".join([f"Client's query: '{q}'" for q in request.message])
    context = f"PDF Context:\n{pdf_text}"

    response = model.generate_content(
        contents=[system_prompt, context, user_prompt]
    )

    return JSONResponse(content={"answer": response.text})

@router.post("/ask_Startup/")
async def ask_gemini_dataset2(request: QueryRequest):
    dataset_path = os.path.join(DATASETS_DIR, DATASET2)
    if not os.path.exists(dataset_path):
        raise HTTPException(status_code=400, detail="Dataset2 does not exist.")

    pdf_text = extract_pdf_text(dataset_path)
    system_prompt = (
        "You are an AI Legal Advisor and Facilitator. You answer all questions related to doing business in Bangladesh. "
        "You answer concisely and in detail using the PDF context. Provide links if possible. "
        "Focus on answering the LAST query while considering all previous queries and PDF context."
    )
    user_prompt = " | ".join([f"Client's query: '{q}'" for q in request.message])
    context = f"PDF Context:\n{pdf_text}"

    response = model.generate_content(
        contents=[system_prompt, context, user_prompt]
    )

    return JSONResponse(content={"answer": response.text})
