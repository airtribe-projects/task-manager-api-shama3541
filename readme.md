# Task Management API

## Overview
This is a simple **Task Management API** built with **Node.js and Express.js** that allows users to create, read, update, and delete tasks. The tasks are stored in a JSON file (`task.json`).

## Features
- **Retrieve all tasks** (with optional filtering by completion status)
- **Retrieve a task by ID**
- **Retrieve tasks by priority level**
- **Create a new task**
- **Update an existing task**
- **Delete a task**

## Installation & Setup

### Prerequisites
- **Node.js** installed on your system.

### Steps
1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/task-management-api.git
   cd task-management-api
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node server.js
   ```
4. The server will run on **`http://localhost:3000`**.

## API Endpoints

### Get All Tasks
```http
GET /tasks
```
#### Optional Query Parameter:
| Parameter | Type    | Description |
|-----------|--------|-------------|
| completed | Boolean | Filter tasks by completion status (`true` or `false`) |

---
### Get Task by ID
```http
GET /tasks/:id
```
- Retrieves a task by its unique ID.

---
### Get Tasks by Priority
```http
GET /tasks/filter/:level
```
- `level` can be `high`, `medium`, or `low`.

---
### Create a Task
```http
POST /tasks
```
#### Request Body (JSON):
```json
{
  "title": "Task Title",
  "description": "Task Description",
  "completed": false,
  "priority": "high"
}
```

---
### Update a Task
```http
PUT /tasks/:id
```
#### Request Body (JSON):
```json
{
  "title": "Updated Title",
  "description": "Updated Description",
  "completed": true
}
```

---
### Delete a Task
```http
DELETE /tasks/:id
```
- Deletes a task by its ID.

## Middleware
- **Validation Middleware (`middleware.js`)**: Ensures that required fields are provided when creating or updating a task.
- **Filter Middleware (`filteridmiddleware.js`)**: Ensures that the priority level is valid when filtering tasks.

## License
This project is licensed under the **MIT License**.

---

### 🎯 Future Improvements
- Migrate storage from a JSON file to a database (MongoDB or PostgreSQL).
- Add authentication and authorization.
- Implement task due dates and reminders.



                        