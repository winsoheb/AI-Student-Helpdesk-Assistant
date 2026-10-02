# Chapter 8: API Documentation

Base URL: `http://localhost:5000/api/v1`

## Auth Routes
- `POST /auth/login`: Accepts JSON `{username, password}`. Sets HTTP-only session cookie.
- `GET /auth/me`: Returns current user role/ID.
- `POST /auth/logout`: Clears session.

## Admin Routes (Requires Admin Role)
- `GET /admin/dashboard`: Returns analytics (total_students, ai_trends, etc).
- `GET, POST, DELETE /admin/students`: Manage students. POST auto-generates Roll No and creates User.
- `GET, POST, DELETE /admin/faculty`: Manage faculty. POST auto-generates Faculty ID and creates User.
- `GET, POST, DELETE /admin/departments`: Manage departments.
- `GET, POST, DELETE /admin/subjects`: Manage subjects.
- `GET, POST, DELETE /admin/materials`: Manage materials. POST accepts `multipart/form-data` and triggers `process_and_store_document()`.
- `GET, POST, DELETE /admin/assignments`: Manage assignments.
- `GET, POST, DELETE /admin/timetable`: Manage timetables.
- `GET, POST, DELETE /admin/announcements`: Manage announcements.
- `GET /admin/chats`: View chat logs for monitoring.

## Student Routes (Requires Student Role)
- `GET /student/profile`: Get student details.
- `GET /student/timetable`: Get timetable for student's course/semester.
- `GET /student/materials`: Get materials for student's subjects.
- `GET /student/assignments`: Get assignments for student's subjects.
- `GET /student/announcements`: View announcements relevant to the student's course.