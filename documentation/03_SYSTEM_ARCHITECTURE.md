# Chapter 4: System Architecture

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