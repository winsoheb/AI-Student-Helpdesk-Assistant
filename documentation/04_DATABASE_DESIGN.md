# Chapter 5: Database Design

The system relies on SQLite via SQLAlchemy. 

## Tables
1. **users:** id, username, email, password_hash, role, is_active, created_at.
2. **departments:** id, department_name, department_code, description.
3. **courses:** id, department_id (FK), course_name, course_code, duration_years.
4. **subjects:** id, course_id (FK), subject_name, subject_code, semester.
5. **students:** id, user_id (FK), student_roll_number, full_name, department_id (FK), course_id (FK), semester, admission_year.
6. **faqs:** id, question, answer, category, department_id.
7. **study_materials:** id, title, description, original_filename, stored_filename, file_type, file_path, subject_id, uploaded_by.
8. **document_chunks:** id, study_material_id (FK), chunk_index, chunk_text (Stores chunked paragraphs).
9. **assignments:** id, title, description, subject_id, issue_date, due_date, maximum_marks, status.
10. **examinations:** id, subject_id, exam_date, start_time, end_time, exam_type, location.
11. **timetable:** id, course_id, subject_id, semester, weekday, start_time, end_time, faculty_name, classroom.
12. **announcements:** id, title, description, target_department_id, target_course_id.
13. **chat_sessions:** id, student_id (FK), session_title, created_at.
14. **chat_messages:** id, session_id (FK), sender ('student' or 'bot'), message, intent, created_at.
15. **feedback:** id, student_id, chat_message_id, rating, comments.
16. **faculty:** id, user_id (FK), faculty_id, full_name, department_id, designation, contact_number.

## Relationships
- A `User` (student role) has one `Student` profile.
- A `User` (faculty role) has one `Faculty` profile.
- A `Department` has many `Courses`, `Students`, and `Faculty`.
- A `StudyMaterial` has many `DocumentChunks`.
- A `ChatSession` has many `ChatMessages`.