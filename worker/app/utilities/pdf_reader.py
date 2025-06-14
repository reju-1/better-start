from pypdf import PdfReader
from typing import IO


def extract_text_from_pdf(file: IO) -> str:
    reader = PdfReader(file)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text.strip()
