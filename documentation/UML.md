# UML Diagrams Description

## 1. Use Case Diagram
**Actors**: Admin, Student
**Use Cases (Admin)**:
- Login/Logout
- Manage College Hierarchy (Dept, Course, Subject)
- Manage Students
- Upload Study Materials (Triggers NLP text chunking)
- Schedule Timetable & Exams
- Add Assignments & Announcements

**Use Cases (Student)**:
- Login/Logout
- View Dashboard (Profile, Announcements)
- Chat with AI Helpdesk
  - <<includes>> Intent Classification
  - <<includes>> Database Query (Exams, Assignments)
  - <<includes>> TF-IDF Cosine Similarity Search (Study Materials)

## 2. Sequence Diagram (Chatbot Interaction)
1. **Student** types message in UI and clicks Send.
2. UI makes POST request to `/api/chat` (Flask).
3. `student/routes.py` receives request and calls `process_chat_message()`.
4. `chatbot.py` calls `classify_intent()`.
5. *If intent requires DB*: `chatbot.py` queries `SQLAlchemy (SQLite)` and formats result.
6. *If intent requires Document Search*: `chatbot.py` calls `search_documents()`.
7. `document_search.py` vectorizes text via `scikit-learn` and returns highest Cosine Similarity chunk.
8. `chatbot.py` logs conversation in `chat_messages` table.
9. `student/routes.py` returns JSON response to UI.
10. UI renders chat bubble for Student.
