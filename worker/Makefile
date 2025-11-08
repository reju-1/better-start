# Define virtual environment paths
UV := uv
ENTRY_POINT := RunWorker.py

# Default target
.DEFAULT_GOAL := help


run:  ## Run RabbitMq worker
	$(UV) run $(ENTRY_POINT)


clean:  ## Clean Python cache and temporary files
	find app/ -type d -name '__pycache__' -exec rm -r {} + -o -name '*.pyc' -delete -o -name '*.pyo' -delete


install:  ## Install dependencies from pyproject.toml using uv
	$(UV) sync


help:  ## Show all available targets
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'
