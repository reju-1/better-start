# Project Documentation

## Overview

This project is a Kanban-style task management system built using FastAPI and SQLModel. It allows users to create, manage, and track projects and tasks efficiently. The system is designed to facilitate collaboration among team members and streamline project workflows.

## Features

- **Project Management**: Create, read, update, and delete projects. Manage project status and priority levels.
- **Task Management**: Create, read, update, and delete tasks associated with projects. Manage task status and priority levels.
- **Member Management**: Add and manage members for both projects and tasks.
- **API Endpoints**: RESTful API endpoints for all functionalities, allowing easy integration with front-end applications.

## Directory Structure

```
backend
└── src
    ├── features
    │   ├── kanban
    │   │   ├── __init__.py
    │   │   ├── project_models.py
    │   │   ├── project_schemas.py
    │   │   ├── project_services.py
    │   │   ├── project_router.py
    │   │   ├── task_models.py
    │   │   ├── task_schemas.py
    │   │   ├── task_services.py
    │   │   └── task_router.py
    ├── README.md
    └── ...
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd backend/src
   ```
3. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

## Usage

1. Start the FastAPI server:
   ```
   uvicorn main:app --reload
   ```
2. Access the API documentation at `http://127.0.0.1:8000/docs`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
