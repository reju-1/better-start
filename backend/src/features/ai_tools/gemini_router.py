from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List
# from genai_config import model  # Ensure this import points to your model configuration
import os
import PyPDF2

from google import generativeai as genai
from src.core import settings

# Configure Gemini API Key
genai.configure(api_key=settings.gemini_api_key)  # Replace with env variable in production

# Create and export model instance
model = genai.GenerativeModel(model_name="gemini-2.0-flash")



router = APIRouter(prefix="/gemini", tags=["Gemini"])

DATASETS_DIR = os.path.join(os.path.dirname(__file__), "datasets")
DATASET1 = "Bangladesh Corporate Document Proposals Dataset Creation.pdf"
DATASET2 = "Bangladesh Startup Document Dataset Creation.pdf"
DATASET3 = "Bangladesh Startup Market Exploration Details.pdf"

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
    "You are an AI Document Advisor and Facilitator in Bangladesh. "
    "You are assisting a client and must respond in a clear, concise, and professional tone. "
    "You have access to a PDF document that contains critical legal and procedural details. "
    "You are given multiple client queries — your task is to answer **only the latest query**, using previous queries as background context. "
    "Do not mention the PDF directly in your response. Instead, speak naturally, as if you already know the information from experience. "
    "Avoid phrases like 'according to the PDF' or 'the document says'. Instead, provide direct answers using facts from the PDF. "
    "If the requested information depends on a specific type (e.g., type of proposal), ask a follow-up question. "
    "Include links to relevant laws, policies, or official sources when appropriate. Do not invent answers or speculate beyond the PDF. Also use markdown formatting for your response."
)
    user_prompt = " | ".join([f"Client's query: '{q}'" for q in request.message])
    context = f"PDF Context:\n{pdf_text}"

    response = model.generate_content(
        contents=[system_prompt, context, user_prompt]
    )

    return JSONResponse(content={"answer": response.text})

@router.post("/ask_startup/")
async def ask_gemini_dataset2(request: QueryRequest):
    dataset_path = os.path.join(DATASETS_DIR, DATASET2)
    if not os.path.exists(dataset_path):
        raise HTTPException(status_code=400, detail="Dataset2 does not exist.")

    pdf_text = extract_pdf_text(dataset_path)
    system_prompt = (
    "You are an expert AI Legal Advisor specializing in business law and corporate regulations in Bangladesh. "
    "You are assisting a client and must respond in a clear, concise, and professional tone. "
    "You have access to a PDF document that contains critical legal and procedural details. "
    "You are given multiple client queries — your task is to answer **only the latest query**, using previous queries as background context. "
    "Do not mention the PDF directly in your response. Instead, speak naturally, as if you already know the information from experience. "
    "Avoid phrases like 'according to the PDF' or 'the document says'. Instead, provide direct answers using facts from the PDF. "
    "If the requested information depends on a specific type (e.g., type of proposal), ask a follow-up question. "
    "Include links to relevant laws, policies, or official sources when appropriate. Do not invent answers or speculate beyond the PDF. Also use markdown formatting for your response."
)
    user_prompt = " | ".join([f"Client's query: '{q}'" for q in request.message])
    context = f"PDF Context:\n{pdf_text}"

    response = model.generate_content(
        contents=[system_prompt, context, user_prompt]
    )

    return JSONResponse(content={"answer": response.text})

@router.post("/ask_market/")
async def ask_gemini_dataset3(request: QueryRequest):
    dataset_path = os.path.join(DATASETS_DIR, DATASET3)
    if not os.path.exists(dataset_path):
        raise HTTPException(status_code=400, detail="Dataset3 does not exist.")

    pdf_text = extract_pdf_text(dataset_path)
    system_prompt = (
    "You are an expert AI Market and Investment Advisor specializing in business law and corporate regulations in Bangladesh. "
    "You are assisting a client and must respond in a clear, concise, and professional tone. "
    "You have access to a PDF document that contains critical legal and procedural details. "
    "You are given multiple client queries — your task is to answer **only the latest query**, using previous queries as background context. "
    "Do not mention the PDF directly in your response. Instead, speak naturally, as if you already know the information from experience. "
    "Avoid phrases like 'according to the PDF' or 'the document says'. Instead, provide direct answers using facts from the PDF. "
    "If the requested information depends on a specific type (e.g., type of proposal), ask a follow-up question. "
    "Include links to relevant laws, policies, or official sources when appropriate. Do not invent answers or speculate beyond the PDF. Also use markdown formatting for your response."
)
    user_prompt = " | ".join([f"Client's query: '{q}'" for q in request.message])
    context = f"PDF Context:\n{pdf_text}"

    response = model.generate_content(
        contents=[system_prompt, context, user_prompt]
    )

    return JSONResponse(content={"answer": response.text})