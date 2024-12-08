Task Manager Application
Overview
This web application allows users to manage tasks effectively. Built using React with TypeScript for the frontend and Flask for the backend, it includes features such as creating, reading, updating, and deleting tasks, as well as filtering and sorting tasks by category and title. The app is designed to be responsive and user-friendly, utilizing Material-UI for a modern interface.

Features
Task Management: Create, edit, delete, and view tasks.
Mark as Complete: Tasks can be marked as complete, indicating their status.
Category Filtering: Filter tasks by category.
Sorting Options: Sort tasks by title.
Responsive Design: Built with Material-UI for a seamless user experience.
Category Management: Tasks can be assigned to different categories.
Tech Stack
Frontend: React, TypeScript, Material-UI
Backend: Flask
Database: SQLite 3
Setup and Running the Application Locally
Prerequisites
Node.js (v14.x or higher)
npm (or yarn)
Python (v3.8 or higher)
SQLite (pre-installed with Python)
1. Clone the repository
bash
Copy code
git clone https://github.com/PazMiz/Tasks.git
cd Tasks
2. Frontend Setup
Navigate to the frontend directory:

bash
Copy code
cd Tasks_Assignment/Tasks/task-manager
Install dependencies:

bash
Copy code
npm install
# or
yarn install
Start the development server:

bash
Copy code
npm start
# or
yarn start
The frontend will be available at http://localhost:3000/.

3. Backend Setup
Navigate to the backend directory:

bash
Copy code
cd Tasks_Assignment/Tasks/
Create a virtual environment (optional but recommended):

bash
Copy code
python -m venv venv
source venv/bin/activate  # On Windows use venv\Scripts\activate
Install dependencies:

bash
Copy code
pip install -r requirements.txt
Run the Flask server:

bash
Copy code
python app.py
The backend will be available at http://127.0.0.1:5000.

Database Schema
tasks Table
Column	Data Type	Description
id	INTEGER	Unique task identifier
title	TEXT	Task title
description	TEXT	Task description
completed	BOOLEAN	Completion status
created_at	TIMESTAMP	Task creation timestamp
category_id	INTEGER	ID referencing categories table
categories Table
Column	Data Type	Description
id	INTEGER	Unique category identifier
name	TEXT	Name of the category
API Endpoints
Task Management
GET /tasks: Retrieves all tasks. Response: 200 OK with a list of tasks.
GET /tasks/{id}: Retrieves a specific task by ID. Response: 200 OK with task details.
POST /tasks: Creates a new task. Request Body: JSON with title, description, and optional category_id. Response: 201 Created with the task object.
PUT /tasks/{id}: Updates an existing task. Request Body: JSON with title, description, completed, and category_id. Response: 200 OK with updated task details.
DELETE /tasks/{id}: Deletes a task by ID. Response: 204 No Content.
PUT /tasks/{id}/complete: Marks a task as complete by ID. Response: 200 OK with the updated task details.
Category Management
GET /categories: Retrieves all categories. Response: 200 OK with a list of categories.
POST /categories/new: Creates a new category. Request Body: JSON with the name of the category. Response: 201 Created with the category object.
Creating a New Category
To create a new category, send a POST request to the following endpoint:

Endpoint: POST /categories/new
URL: http://127.0.0.1:5000/categories/new
Request Body
Content-Type: application/json
JSON payload:
json
Copy code
{
  "name": "New Category"
}
How to Post Using Postman/Thunder:
Open Postman or Thunder.
Set the request type to POST.
Enter the URL: http://127.0.0.1:5000/categories/new.
Go to the Body section, select raw, and choose JSON format.
Add the JSON payload:
json
Copy code
{
  "name": "New Category"
}
Click Send to create the category.
Response
Success (201 Created):

json
Copy code
{
  "message": "Category created successfully",
  "category": {
    "id": 1,
    "name": "New Category"
  }
}
Error (400 Bad Request):

json
Copy code
{
  "error": "Category name is required"
}
or

json
Copy code
{
  "error": "Category already exists"
}
Code Overview
Frontend
App.tsx: Main React component managing state and rendering the UI.
TaskForm.tsx: Form component for adding and editing tasks.
TaskList.tsx: Displays the list of tasks with options to edit, delete, toggle completion, and mark as complete.
api.ts: Contains functions for API calls to the backend.
Backend
app.py: Main Flask application file defining routes and handling API requests.
requirements.txt: Python package dependencies for the backend.
Example Usage
Start the Flask server using python app.py.
Start the React development server using npm start.
Access the application at http://localhost:3000/ in your browser.
Use the UI to manage tasks, including adding, editing, deleting, filtering, sorting, and marking tasks as completed.
Future Enhancements
Search Functionality: Add search capabilities for tasks by title or description.
Pagination: Introduce pagination for large task lists.
License
This project is licensed under the MIT License.

Acknowledgements
Material-UI: For providing the UI components.
Flask: For the lightweight backend framework.
