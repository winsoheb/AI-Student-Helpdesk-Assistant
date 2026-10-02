import os

docs_dir = "documentation"
diagrams_dir = os.path.join(docs_dir, "diagrams")
screenshots_dir = os.path.join(docs_dir, "screenshots")

os.makedirs(docs_dir, exist_ok=True)
os.makedirs(diagrams_dir, exist_ok=True)
os.makedirs(screenshots_dir, exist_ok=True)

files = {}

files["01_PROJECT_REPORT.md"] = """# AI Student Helpdesk Assistant

**Academic Project Report**

Submitted in partial fulfillment of the requirements for the degree of 
[Degree Name] in [Department Name]

Submitted By:
- [Student Name 1] (Roll No: [Roll Number 1])
- [Student Name 2] (Roll No: [Roll Number 2])

Under the Guidance of:
[Guide Name]
[Guide Designation]

[College Name]
[Academic Year]

---

## DECLARATION
We hereby declare that the project entitled "AI Student Helpdesk Assistant" submitted to [College Name] is a record of an original work done by us under the guidance of [Guide Name].

## ACKNOWLEDGEMENT
We express our sincere gratitude to [Guide Name] for their invaluable guidance.

## ABSTRACT
The AI Student Helpdesk Assistant is a centralized academic management and self-service portal designed to streamline information retrieval in educational institutions. The system replaces manual enquiry processes with an intelligent Extractive QA Chatbot (built using TF-IDF and Cosine Similarity) that provides instant answers from college-uploaded documents (PDF/DOCX), alongside real-time updates on assignments, timetables, and announcements.

## Table of Contents
1. Introduction
2. Existing and Proposed System
3. Requirement Analysis
4. System Architecture
5. Database Design
6. System Modules
7. AI Chatbot Implementation
8. API Documentation
9. Testing
10. Conclusion
"""

files["02_PROJECT_OVERVIEW.md"] = """# Chapter 1: Introduction

## 1.1 Background
Educational institutions generate vast amounts of operational and academic information. Students often struggle to find answers to routine questions, leading to administrative overhead.

## 1.2 Problem Statement
Information is distributed across notice boards, disparate documents, and departments. Finding academic information is time-consuming, resulting in repeated queries to the administration.

## 1.3 Project Objectives
- Centralize academic information (timetables, assignments, announcements).
- Provide a Student Self-Service Portal.
- Implement an AI-based chatbot using NLP techniques (TF-IDF) to extract answers from uploaded PDFs and DOCX files.
- Deliver an Administrative Dashboard for real-time analytics.

## 1.4 Project Scope
The project covers Admin capabilities (managing students, subjects, materials, etc.) and Student capabilities (interacting with the AI, viewing timetables/assignments). It operates offline using a local database and ML libraries, strictly adhering to zero-internet-dependency rules.

## 1.5 Limitations
- The AI relies on Extractive QA (TF-IDF), so it extracts verbatim text rather than generating new contextual sentences (LLM).
- Scalability is bounded by SQLite capabilities.

# Chapter 2: Existing and Proposed System

## 2.1 Existing System
- Manual student enquiry handling.
- Information distributed across notices, documents, and departments.
- Repeated questions to college administration.

## 2.2 Proposed System
- **Centralized Academic Information:** A single digital repository for college data.
- **Student Self-Service Portal:** View profiles, timetables, and assignments.
- **AI-based Question Answering:** An offline chatbot that parses college-uploaded study materials to answer queries instantly.
- **Administrative Information Management:** A Next.js dashboard for admins (including Faculty and Announcement management).
- **Dynamic Theming Engine:** A robust Light/Dark mode and accent color system customizable per user.
"""

files["03_SYSTEM_ARCHITECTURE.md"] = """# Chapter 4: System Architecture

## 4.1 Frontend Architecture
The frontend is a Single Page Application (SPA) built using **Next.js (React 19)**. 
- **Styling:** TailwindCSS 4.
- **Animations & Visuals:** Framer Motion, Recharts, Lucide-React.
- **Routing:** Next.js App Router.

## 4.2 Backend Architecture
The backend is a RESTful API powered by **Flask**.
- **API Routing:** Flask Blueprints (`/api/v1`).
- **Auth:** Flask-Login and Werkzeug Security.
- **Server:** Waitress (WSGI).

## 4.3 Database Architecture
**SQLite3** mapped via **Flask-SQLAlchemy** (ORM).

## 4.4 AI Processing Architecture
Uses an **Extractive QA pipeline**. 
1. **Document Processing:** PDFs (PyPDF2) and DOCX (python-docx) are parsed.
2. **Chunking:** Text is chunked by sentences/paragraphs (max 150 words) to preserve semantic boundaries.
3. **Storage:** Chunks are saved in SQLite (`document_chunks` table).
4. **Retrieval (TF-IDF):** User queries are vectorized against chunks using Scikit-Learn's `TfidfVectorizer`. The highest Cosine Similarity chunk is extracted.

## 4.5 Workflow
1. User interacts with React UI.
2. React sends JSON/FormData via Fetch API to Flask backend.
3. Flask validates session and interacts with SQLite via SQLAlchemy.
4. If it's a Chat query, Flask invokes the NLP engine to extract the best match.
5. JSON response is returned to React.
"""

files["04_DATABASE_DESIGN.md"] = """# Chapter 5: Database Design

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
"""

files["05_SYSTEM_DIAGRAMS.md"] = """# System Diagrams

Diagrams have been provided in the `/diagrams` folder in `.mmd` (Mermaid) format.
1. `system_architecture.mmd`
2. `er_diagram.mmd`
3. `use_case.mmd`
4. `sequence_diagram.mmd`
5. `activity_diagram.mmd`
6. `dfd_level_0.mmd`
7. `dfd_level_1.mmd`
"""

files["06_MODULE_DOCUMENTATION.md"] = """# Chapter 6: System Modules

## 6.1 Administrator Module
- **Dashboard Analytics:** Real-time metrics (Total students, FAQs, Uploads) and charts (AI usage trends, Students by Dept) built with Recharts.
- **Student & Faculty Management:** Add students and faculty with auto-generated Roll/Faculty IDs.
- **Subject Management:** Create subjects linked to courses.
- **Study Materials:** Upload PDFs/DOCX which trigger AI processing.
- **Timetable & Assignments:** Create academic schedules using dropdown selectors for Subjects.
- **Chat Monitoring:** View logs of student queries.
- **Announcements:** Post real-time updates targeted to specific courses or departments.

## 6.2 Student Module
- **AI Chatbot Interface:** Interact with the college knowledge base via a chat interface.
- **Timetable View:** See class schedules filtered by the student's department/semester.
- **Assignments View:** Track due dates for enrolled subjects.
- **Materials View:** Browse and download uploaded PDFs/DOCX.

## 6.3 Global UI Engine
- **Theme Customization:** Global Context-driven theme engine supporting Light, Dark, and System modes, alongside 8 custom accent colors (Blue, Violet, Purple, Cyan, Green, Orange, Rose, Teal) persisted in local storage.
"""

files["07_AI_CHATBOT_DOCUMENTATION.md"] = """# Chapter 7: AI Chatbot Implementation

## 7.1 Architecture
The chatbot operates entirely offline using NLP (Natural Language Processing) and Extractive QA, strictly bypassing LLMs (Large Language Models) to ensure zero internet dependence and rapid execution.

## 7.2 Processing Workflow
1. **Document Upload:** Admin uploads a PDF/DOCX.
2. **Text Extraction:** `PyPDF2` or `python-docx` extracts raw text.
3. **Chunking:** The text is split via Regex by sentence boundaries (`. ! ?`), grouped into blocks of ~150 words. Stored in `document_chunks`.
4. **Querying:** Student submits a question.
5. **Intent Classification:** Basic classification checks for intents like `EXAM_SCHEDULE` or `TIMETABLE` to route to SQL queries directly.
6. **Vectorization (TF-IDF):** If intent is general, the system uses Scikit-Learn `TfidfVectorizer` to convert all document chunks + the user query into numerical vectors.
7. **Cosine Similarity:** Measures the cosine angle between the query vector and chunk vectors.
8. **Heuristic Filter:** Penalizes chunks with high density of '?' to avoid extracting Tables of Contents.
9. **Extraction:** The highest-scoring chunk is returned to the user neatly formatted with blockquotes.
"""

files["08_API_DOCUMENTATION.md"] = """# Chapter 8: API Documentation

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
"""

files["09_TESTING_REPORT.md"] = """# Chapter 9: Testing

| Test ID | Test Scenario | Input | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| TC_01 | Admin Login | admin/admin | Redirect to Admin Dashboard | Redirected successfully | Passed |
| TC_02 | Student Login | 2023MBA001/pass | Redirect to Student Portal | Redirected successfully | Passed |
| TC_03 | Upload Study Material | Valid PDF File | File saved, AI chunks generated | File saved in uploads, chunks in DB | Passed |
| TC_04 | Add Student | Name, Dept, Year | Auto-generated Roll Number & User Account | 2024CS001 created | Passed |
| TC_05 | AI Query (Schedule) | "What is my timetable?" | Returns SQL timetable data | Returned structured timetable | Passed |
| TC_06 | AI Query (Material) | "What is a static variable" | Returns paragraph from PDF via TF-IDF | Returned correct chunk avoiding TOC | Passed |
| TC_07 | AI Query (Unknown) | "Gibberish" | Returns "I couldn't find verified info" | Fallback triggered | Passed |
| TC_08 | Unauthorized Access | Student hits `/admin/students` | 403 Unauthorized | 403 Returned | Passed |
"""

files["10_USER_MANUAL.md"] = """# Chapter 10: User Manual (Student)

1. **Logging In:** Open the web browser to the provided URL. Enter your auto-generated Roll Number and Password provided by administration.
2. **Dashboard:** View your upcoming assignments and announcements.
3. **Chatbot Interface:** Click on "Ask AI Assistant" to open the chat window. Type questions about academics or college rules. The AI will instantly search college documents and reply.
4. **Study Materials:** Click the "Materials" tab to download raw PDFs uploaded by your professors.
5. **Timetable:** Click "Timetable" to see your weekly class schedule.
"""

files["11_ADMIN_MANUAL.md"] = """# Chapter 11: Admin Manual

1. **Dashboard:** View live charts of AI usage and student distributions.
2. **Adding a Subject:** Go to "Subjects" -> "Add Subject". Fill in the details. This is required before adding timetables.
3. **Uploading Materials:** Go to "Study Materials" -> "Add Material". Select the subject from the dropdown, upload a PDF. The system will say "Uploading & AI Processing". This means it is breaking the PDF into sentences to teach the AI.
4. **Managing Students & Faculty:** Go to "Students" or "Faculty". Fill in their basic details. The system auto-generates their ID (e.g., `2024IT005` or `FCOMP001`) and sets their password to their ID.
5. **Publishing Announcements:** Go to "Announcements". You can post a message and optionally target it to a specific course or department.
6. **Chat Monitoring:** Go to "Chat Monitoring" to see what students are asking the AI Assistant.
"""

files["12_INSTALLATION_GUIDE.md"] = """# Chapter 12: Installation and Deployment

## Prerequisites
- Python 3.9+
- Node.js v18+

## Backend Setup
1. Open PowerShell and navigate to the root directory.
2. Create virtual environment: `python -m venv venv`
3. Activate it: `.\\venv\\Scripts\\Activate.ps1`
4. Install dependencies: `pip install -r requirements.txt`
5. Run server: `python run.py`. The SQLite database (`helpdesk.db`) and `uploads/` folder will be auto-generated in `user_data/`.

## Frontend Setup
1. Navigate to the `frontend/` directory.
2. Install dependencies: `npm install`
3. Run dev server: `npm run dev`
4. Open `http://localhost:3000` in your browser.

*Note: The frontend is configured to communicate with the Flask API at `http://localhost:5000`.*
"""

files["13_VIVA_QUESTIONS.md"] = """# Chapter 13: Viva Preparation

**Q1: Explain your project in two minutes.**
*Ans:* It's an offline AI-powered college helpdesk. It centralizes timetables and assignments, but its main feature is an Extractive AI Chatbot. Instead of using internet-reliant LLMs, it parses uploaded PDFs using NLP and retrieves exact answers using TF-IDF and Cosine Similarity.

**Q2: Why did you choose Python?**
*Ans:* Python has excellent libraries for Natural Language Processing (Scikit-Learn) and document parsing (PyPDF2), making it perfect for the AI backend.

**Q3: What is TF-IDF?**
*Ans:* Term Frequency-Inverse Document Frequency. It's a statistical measure that evaluates how relevant a word is to a document in a collection of documents. It helps the AI find the exact paragraph that answers a question.

**Q4: What is cosine similarity?**
*Ans:* It measures the cosine of the angle between two vectors. We convert the student's question and the document chunks into vectors using TF-IDF, and Cosine Similarity finds the closest match.

**Q5: How do you prevent incorrect chatbot answers?**
*Ans:* Because it is an Extractive QA system, it cannot "hallucinate" or invent fake answers. It is strictly limited to extracting exact paragraphs from verified college documents. If the similarity score is too low, it admits it doesn't know.

**Q6: Why use SQLite?**
*Ans:* It requires zero setup and configuration, making it perfectly portable for an offline desktop application while still supporting robust relational queries through SQLAlchemy.
"""

files["14_PROJECT_PRESENTATION.md"] = """# Chapter 14: Project Presentation Outline

**Slide 1: Title** - AI Student Helpdesk Assistant
**Slide 2: Introduction** - Centralized portal for college data.
**Slide 3: Problem Statement** - Finding specific academic info in PDFs is tedious.
**Slide 4: Objectives** - Build an offline NLP search engine for college documents.
**Slide 5: Existing vs Proposed** - Manual query vs Self-service AI.
**Slide 6: Technology Stack** - Flask, SQLite, Scikit-Learn, Next.js, Tailwind.
**Slide 7: System Architecture** - API-driven headless architecture.
**Slide 8: Database Design** - SQLite relational models.
**Slide 9: Main Modules** - Admin Dashboard, Student Portal, Chatbot.
**Slide 10: AI Chatbot Workflow** - PDF -> Chunking -> TF-IDF Vectorization -> Cosine Similarity.
**Slide 11: Screenshots** - Dashboard charts, File Upload, Chat interface.
**Slide 12: Testing** - Verified Extractive QA functionality.
**Slide 13: Advantages & Limitations** - 100% Offline and Private, but lacks generative context.
**Slide 14: Future Scope** - Integrating local offline LLMs (like Llama.cpp) for generative capabilities.
**Slide 15: Conclusion** - Successfully reduced enquiry overhead.
"""

files["15_REFERENCES.md"] = """# Chapter 15: References

1. Python Documentation: https://docs.python.org/3/
2. Flask Framework: https://flask.palletsprojects.com/
3. Scikit-learn (TF-IDF & Cosine Similarity): https://scikit-learn.org/
4. Next.js App Router: https://nextjs.org/docs
5. Tailwind CSS: https://tailwindcss.com/docs
6. PyPDF2 Documentation: https://pypdf2.readthedocs.io/
7. SQLAlchemy ORM: https://www.sqlalchemy.org/
"""

for filename, content in files.items():
    with open(os.path.join(docs_dir, filename), "w") as f:
        f.write(content.strip())

diagrams = {}

diagrams["system_architecture.mmd"] = '''graph TD
    UI[Next.js Frontend React] <-->|JSON over HTTP| API[Flask REST API]
    API <--> ORM[SQLAlchemy]
    ORM <--> DB[(SQLite Database)]
    API <--> NLP[TF-IDF AI Engine]
    NLP <--> FileSys[Local Uploads Dir]
'''

diagrams["er_diagram.mmd"] = '''erDiagram
    USER ||--o| STUDENT : has
    USER ||--o| FACULTY : has
    DEPARTMENT ||--o{ STUDENT : contains
    DEPARTMENT ||--o{ FACULTY : employs
    DEPARTMENT ||--o{ COURSE : offers
    COURSE ||--o{ SUBJECT : includes
    STUDENT ||--o{ CHAT_SESSION : owns
    CHAT_SESSION ||--o{ CHAT_MESSAGE : contains
    SUBJECT ||--o{ STUDY_MATERIAL : has
    STUDY_MATERIAL ||--o{ DOCUMENT_CHUNK : chunked_into
'''

diagrams["use_case.mmd"] = '''
graph TD
    Student[Student] --> AskChatbot(Ask Chatbot)
    Student --> ViewTimetable(View Timetable)
    Student --> DownloadMaterial(Download Material)
    
    Admin[Admin] --> UploadMaterial(Upload Material)
    Admin --> ManageStudents(Manage Students)
    Admin --> ViewAnalytics(View Analytics Dashboard)
'''

diagrams["sequence_diagram.mmd"] = '''sequenceDiagram
    actor Student
    participant Frontend
    participant API
    participant AI
    participant DB
    
    Student->>Frontend: Ask "What is static variable?"
    Frontend->>API: POST /chat {msg}
    API->>AI: search_documents(msg)
    AI->>DB: Fetch DocumentChunks
    DB-->>AI: chunks[]
    AI->>AI: Vectorize & Cosine Similarity
    AI-->>API: Extracted Answer
    API-->>Frontend: JSON Response
    Frontend-->>Student: Display Answer
'''

diagrams["activity_diagram.mmd"] = '''graph TD
    Start[User types message] --> API[Backend receives message]
    API --> CheckIntent{Is Intent Structured?}
    CheckIntent -->|Yes, e.g. Timetable| DBQuery[Query SQLite directly]
    CheckIntent -->|No, General QA| NLP[Run TF-IDF on Chunks]
    NLP --> Threshold{Score > 0.05?}
    Threshold -->|Yes| Extract[Return best chunk]
    Threshold -->|No| Fallback[Return fallback message]
    DBQuery --> Response[Send JSON to UI]
    Extract --> Response
    Fallback --> Response
'''

diagrams["dfd_level_0.mmd"] = '''graph TD
    Student -->|Queries| Sys[AI Helpdesk System]
    Sys -->|Answers & Data| Student
    Admin -->|Uploads PDFs, Data| Sys
    Sys -->|Analytics| Admin
'''

diagrams["dfd_level_1.mmd"] = '''graph TD
    Student -->|Ask Question| Process1[Chatbot Engine]
    Admin -->|Upload PDF| Process2[Document Processor]
    Process2 -->|Raw Text| Process3[Chunking Engine]
    Process3 -->|Text Chunks| DB[(Database)]
    Process1 -->|Vector Search| DB
    DB -->|Best Match| Process1
    Process1 -->|Formatted Answer| Student
'''

for filename, content in diagrams.items():
    with open(os.path.join(diagrams_dir, filename), "w") as f:
        f.write(content.strip())

screenshot_readme = '''# Screenshots Checklist

Please manually capture the following screenshots to include in your project report and presentation:

- [ ] `login_page.png` - The authentication screen.
- [ ] `student_dashboard.png` - The main portal showing announcements.
- [ ] `ai_chatbot.png` - The chat interface showing a question and an extracted answer.
- [ ] `admin_analytics.png` - The admin dashboard showing Recharts (Pie Chart, Area Chart).
- [ ] `admin_upload_material.png` - The form showing the file upload input and subject dropdown.
- [ ] `admin_students_list.png` - Table showing students and auto-generated roll numbers.
- [ ] `student_timetable.png` - The timetable view for a student.
'''
with open(os.path.join(screenshots_dir, "README.md"), "w") as f:
    f.write(screenshot_readme.strip())

print("Documentation generated successfully!")
