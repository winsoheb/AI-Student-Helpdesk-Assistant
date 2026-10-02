# Database Design Dictionary

The system uses SQLite mapped via SQLAlchemy ORM.

### 1. Table: `users`
- **id** (Integer, Primary Key)
- **username** (String 50, Unique)
- **password_hash** (String 256)
- **role** (String 20) - 'admin' or 'student'

### 2. Table: `study_materials`
- **id** (Integer, Primary Key)
- **title** (String 255)
- **original_filename** (String 255)
- **file_type** (String 20)
- **file_path** (String 500)
- **subject_id** (Integer, Foreign Key)

### 3. Table: `document_chunks`
- **id** (Integer, Primary Key)
- **study_material_id** (Integer, Foreign Key)
- **chunk_index** (Integer)
- **chunk_text** (Text) - *Used for Scikit-Learn TF-IDF vectorization.*

### 4. Table: `chat_messages`
- **id** (Integer, Primary Key)
- **session_id** (Integer, Foreign Key)
- **sender** (String 20) - 'student' or 'bot'
- **message** (Text)
- **intent** (String 50) - E.g., 'EXAM_SCHEDULE'
