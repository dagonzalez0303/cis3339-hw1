# Student Management System

A full-stack app for managing students, courses, and enrollments, built with **Vue 3** (Composition API, Vue Router, Pinia), **Express**, and **MongoDB**.

CIS 3339 Homework 1. The original assignment instructions are in [docs/ASSIGNMENT.md](docs/ASSIGNMENT.md).

## Features

- **Students**: add a student (name, student ID, phone, ZIP), search by name or ID, view details, and delete.
- **Courses**: add a course (course ID, name), list all courses, and delete.
- **Enrollments**: enroll an existing student in an existing course, view a course roster, and remove an enrollment.
- **Data integrity**: duplicate students, courses, and enrollments are rejected. Deleting a student or course also deletes its enrollments.
- **Validation and feedback**: field-level validation messages, loading spinners, success and error notifications, and empty states.
- **Responsive and accessible**: works at desktop and mobile widths, has labeled controls, keyboard support, and a dark mode.

## Required Software

| Software | Version |
|---|---|
| [Node.js](https://nodejs.org/) (includes npm) | 20.19+ or 22.12+ |
| [MongoDB Community Edition](https://www.mongodb.com/docs/manual/administration/install-community/) | 7.0 or newer (tested with 9.0) |
| A modern web browser | Chrome, Firefox, Safari, or Edge |

No cloud database, MongoDB Atlas, or credentials are needed.

## Environment Variables

The app reads its settings from [backend/.env](backend/.env), which is committed to the repository and works as-is:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/cis3339_homework1
PORT=3000
```

| Variable | Purpose | Default |
|---|---|---|
| `MONGODB_URI` | Local MongoDB connection string | `mongodb://127.0.0.1:27017/cis3339_homework1` |
| `PORT` | Port the Express server listens on | `3000` |

The `cis3339_homework1` database does not need to exist beforehand. On startup the app automatically creates the `students`, `courses`, and `enrollments` collections and their indexes. No setup, migration, or seed command is needed.

## Start MongoDB

Start MongoDB Community Edition before running the app.

**macOS (Homebrew)**

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Windows**

MongoDB is installed as a Windows service and starts automatically. To start it manually, run this in an Administrator command prompt:

```bash
net start MongoDB
```

**Linux (systemd)**

```bash
sudo systemctl start mongod
```

To check that it is running:

```bash
mongosh --eval "db.runCommand({ ping: 1 })"
```

## Install, Build, and Run

Run these commands from the project root folder (the folder containing this README):

```bash
npm install      # installs backend and frontend dependencies
npm run build    # builds the Vue frontend into frontend/dist
npm start        # starts the Express server
```

Then open **http://localhost:3000** in your browser.

The Express server provides both the REST API (`/api/...`) and the built Vue app. Refreshing any page (for example `/courses`) works without a 404.

## Development Mode (optional)

For hot reloading while editing code, run the backend and frontend in two terminals:

```bash
npm run dev:backend    # Express API on http://localhost:3000 (restarts on changes)
npm run dev:frontend   # Vite dev server on http://localhost:5173
```

Then open **http://localhost:5173**. The Vite dev server forwards `/api` requests to the backend.

## Project Structure

```
├── package.json            Root scripts: install, build, start
├── backend/
│   ├── .env                MongoDB connection string and port
│   ├── server.js           Express app: API routes + serves the Vue build
│   ├── config/db.js        Connects to MongoDB and creates collections/indexes
│   ├── models/             Mongoose schemas: Student, Course, Enrollment
│   ├── routes/             REST endpoints for students, courses, enrollments
│   ├── middleware/         JSON error handler
│   └── utils/              Shared helpers
├── frontend/
│   ├── vite.config.js      Vite build and dev proxy settings
│   └── src/
│       ├── main.js         Creates the app with Pinia and Vue Router
│       ├── router/         Routes: /students, /courses, /enrollments
│       ├── stores/         Pinia stores: students, courses, enrollments, notifications
│       ├── views/          One view per page
│       ├── components/     Reusable UI and feature components
│       ├── services/api.js fetch wrapper for the REST API
│       └── utils/          Client-side validation
├── docs/ASSIGNMENT.md      Original assignment instructions
└── images/                 Reference screenshots from the assignment
```

## REST API

All responses are JSON. Errors use the form `{ "error": "message" }`.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/students?search=term` | List students (optional search by partial name or exact ID) |
| GET | `/api/students/:studentId` | Get one student |
| POST | `/api/students` | Add a student: `{ name, studentId, phone, zip }` |
| DELETE | `/api/students/:studentId` | Delete a student and their enrollments |
| GET | `/api/courses` | List courses |
| GET | `/api/courses/:courseId` | Get one course |
| GET | `/api/courses/:courseId/students` | List students enrolled in a course |
| POST | `/api/courses` | Add a course: `{ courseId, name }` |
| DELETE | `/api/courses/:courseId` | Delete a course and its enrollments |
| GET | `/api/enrollments?courseId=...` | List enrollments (optionally for one course) |
| POST | `/api/enrollments` | Enroll a student: `{ studentId, courseId }` |
| DELETE | `/api/enrollments/:id` | Remove one enrollment |

Status codes: `200` OK, `201` created, `400` invalid input, `404` not found, `409` duplicate, `503` database unavailable, `500` server error.

Course IDs are stored in uppercase with single spaces, so `cis 3339` and `CIS 3339` count as the same course. In URLs, encode the space (`/api/courses/CIS%203339`).

## Troubleshooting

| Problem | Fix |
|---|---|
| `Failed to connect to MongoDB: connect ECONNREFUSED` | MongoDB is not running. Start it (see [Start MongoDB](#start-mongodb)) and run `npm start` again. |
| Page says "Frontend has not been built yet" | Run `npm run build`, then `npm start`. |
| `EADDRINUSE: address already in use :::3000` | Another program is using port 3000. Stop it, or change `PORT` in `backend/.env`. |
| A dependency is missing | Run `npm install` from the project root. It installs both `backend/` and `frontend/`. |
