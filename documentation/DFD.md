# Data Flow Diagram (DFD) Description

## Level 0 (Context Diagram)
**External Entities:** Student, Admin
**Process (Center):** AI Student Helpdesk System
**Flows:**
* Admin -> System: Uploads documents, sets timetables/exams, manages users.
* System -> Admin: Success/Error messages, dashboard stats.
* Student -> System: Submits chat queries, login credentials.
* System -> Student: AI chatbot responses, document citations, UI updates.

## Level 1 Diagram
**Main Processes:**
1. **Authentication Process**: Validates Student/Admin login against `users` table.
2. **Academic Management Process**: Handles CRUD operations storing data into `courses`, `subjects`, `materials` tables.
3. **AI Pipeline Process**:
   * Takes Student Question.
   * Extracts Intent.
   * Queries SQL databases for structured data (Exams, Assignments).
   * Queries `document_chunks` table using TF-IDF for unstructured academic queries.
   * Returns formatted string to the Student UI.
