Here's the updated README including the summary of challenges and their solutions:

---

# Task Manager Application

## Overview
This web application allows users to manage tasks effectively. Built using **React with TypeScript** for the frontend and **Flask** for the backend, it includes features such as creating, reading, updating, and deleting tasks, as well as filtering and sorting tasks by category and title. The app is designed to be responsive and user-friendly, utilizing **Material-UI** for a modern interface.

## Features
- **Task Management**: Create, edit, delete, and view tasks.
- **Mark as Complete**: Tasks can be marked as complete, indicating their status.
- **Category Filtering**: Filter tasks by category.
- **Sorting Options**: Sort tasks by title.
- **Responsive Design**: Built with **Material-UI** for a seamless user experience.
- **Category Management**: Tasks can be assigned to different categories.

## Tech Stack
- **Frontend**: React, TypeScript, Material-UI
- **Backend**: Flask
- **Database**: SQLite 3

## Setup and Running the Application Locally

### Prerequisites
- **Node.js** (v14.x or higher)
- **npm** (or **yarn**)
- **Python** (v3.8 or higher)
- **SQLite** (pre-installed with Python)

### 1. Clone the repository
```bash
git clone https://github.com/PazMiz/Tasks.git
cd Tasks
```

### 2. Frontend Setup
Navigate to the frontend directory:
```bash
cd Tasks_Assignment/Tasks/task-manager
```

Install dependencies:
```bash
npm install
# or
yarn install
```

Start the development server:
```bash
npm start
# or
yarn start
```

The frontend will be available at [http://localhost:3000/](http://localhost:3000/).

### 3. Backend Setup
Navigate to the backend directory:
```bash
cd Tasks_Assignment/Tasks/
```

Create a virtual environment (optional but recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows use venv\Scripts\activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Run the Flask server:
```bash
python3 -m flask run
```

The backend will be available at [http://127.0.0.1:5000](http://127.0.0.1:5000).

## Database Schema

### `tasks` Table
| Column       | Data Type      | Description                              |
|--------------|----------------|------------------------------------------|
| id           | INTEGER        | Unique task identifier                   |
| title        | TEXT           | Task title                               |
| description  | TEXT           | Task description                         |
| completed    | BOOLEAN        | Completion status                        |
| created_at   | TIMESTAMP      | Task creation timestamp                  |
| category_id  | INTEGER        | ID referencing categories table          |

### `categories` Table
| Column  | Data Type | Description               |
|---------|-----------|---------------------------|
| id      | INTEGER   | Unique category identifier|
| name    | TEXT      | Name of the category      |

## API Endpoints

### Task Management
- **GET /tasks**: Retrieves all tasks. *Response: 200 OK with a list of tasks.*
- **GET /tasks/{id}**: Retrieves a specific task by ID. *Response: 200 OK with task details.*
- **POST /tasks**: Creates a new task. *Request Body: JSON with title, description, and optional category_id.* *Response: 201 Created with the task object.*
- **PUT /tasks/{id}**: Updates an existing task. *Request Body: JSON with title, description, completed, and category_id.* *Response: 200 OK with updated task details.*
- **DELETE /tasks/{id}**: Deletes a task by ID. *Response: 204 No Content.*
- **PUT /tasks/{id}/complete**: Marks a task as complete by ID. *Response: 200 OK with the updated task details.*

### Category Management
- **GET /categories**: Retrieves all categories. *Response: 200 OK with a list of categories.*
- **POST /categories/new**: Creates a new category. *Request Body: JSON with the category name.* Example payload:
```json
{ 
  "name": "New Category"
}
```

## Code Overview
---

## Code Overview

### Frontend
- **App.tsx**: Main React component managing state and rendering the UI.
- **TaskForm.tsx**: Form component for adding and editing tasks.
- **TaskList.tsx**: Displays the list of tasks with options to edit, delete, toggle completion, and mark as complete.
- **TaskItem.tsx**: A component that represents an individual task. This component encapsulates the logic and rendering of each task, making the code more modular and easier to maintain.
- **api.ts**: Contains functions for API calls to the backend.

---

This will help users understand that `TaskItem.tsx` plays a crucial part in making the code modular and manageable.

### Backend
- **app.py**: Main Flask application file defining routes and handling API requests.
- **requirements.txt**: Python package dependencies for the backend.

## Example Usage
1. Start the Flask server using `python3 -m flask run`.
2. Start the React development server using `npm start`.
3. Access the application at [http://localhost:3000/](http://localhost:3000/) in your browser.
4. Use the UI to manage tasks, including adding, editing, deleting, filtering, sorting, and marking tasks as completed.

## Challenges and Solutions

### Duplicate API Calls in `useEffect`
- **Challenge**: `useEffect` was running twice, leading to duplicate API calls for fetching tasks and categories.
- **Solution**: Identified that `React.StrictMode` in development mode was causing the double invocation. Removed `React.StrictMode` for testing, ensuring `useEffect` runs only once on component mount.

### Debugging API Call Flow
- **Challenge**: Determining why duplicate network calls were occurring.
- **Solution**: Used `console.log` statements to track the behavior and confirmed `React.StrictMode` was the cause, not the code itself.

## Acknowledgements
- **Material-UI**: For providing the UI components.
- **Flask**: For the lightweight backend framework.

--- 

