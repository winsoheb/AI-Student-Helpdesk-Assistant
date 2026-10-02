# Chapter 7: AI Chatbot Implementation

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