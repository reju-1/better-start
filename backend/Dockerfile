FROM python:3.12-slim

# Install uv
RUN pip install --no-cache-dir uv

# Set working directory
WORKDIR /app

# Copy only dependency files first and Install dependencies (cache-friendly)
COPY pyproject.toml uv.lock ./
RUN uv sync

# Copy application code
COPY . .

# Expose FastAPI port
EXPOSE 8000

# Run FastAPI with uv and uvicorn
CMD ["uv", "run", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
