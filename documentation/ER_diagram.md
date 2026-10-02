# Entity Relationship (ER) Diagram Description

Because Markdown doesn't support drawn diagrams natively, here is the structure representing the ER diagram you should draw for the presentation:

## Entities & Primary Keys (PK) / Foreign Keys (FK)

**User Entity**
* `id` (PK)
* `username`
* `password_hash`
* `role`

**Student Entity**
* `id` (PK)
* `user_id` (FK -> User.id)
* `department_id` (FK -> Department.id)
* `course_id` (FK -> Course.id)
* `student_roll_number`

**Academic Entities (Department, Course, Subject)**
* `Department(id PK, name)` <--(1:N)-- `Course(id PK, dept_id FK, name)` <--(1:N)-- `Subject(id PK, course_id FK, name)`

**StudyMaterial Entity**
* `id` (PK)
* `subject_id` (FK -> Subject.id)
* `file_path`
* `title`

**DocumentChunk Entity**
* `id` (PK)
* `study_material_id` (FK -> StudyMaterial.id)
* `chunk_text`

**ChatSession & ChatMessage Entities**
* `Student` --(1:N)--> `ChatSession(id PK, student_id FK)`
* `ChatSession` --(1:N)--> `ChatMessage(id PK, session_id FK, message, sender)`

## Relationships
- A `User` has ONE `Student` profile (1:1).
- A `Department` has MANY `Courses` (1:N).
- A `Course` has MANY `Subjects` (1:N).
- A `Subject` has MANY `StudyMaterials` (1:N).
- A `StudyMaterial` has MANY `DocumentChunks` (1:N).
- A `Student` has MANY `ChatSessions` (1:N).
