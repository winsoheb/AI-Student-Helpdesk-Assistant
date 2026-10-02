import os
from PyPDF2 import PdfReader
from docx import Document as DocxDocument
from database.models import db, DocumentChunk

def extract_text_from_pdf(file_path):
    text = ""
    try:
        reader = PdfReader(file_path)
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
    except Exception as e:
        print(f"Error reading PDF: {e}")
    return text

def extract_text_from_docx(file_path):
    text = ""
    try:
        doc = DocxDocument(file_path)
        for para in doc.paragraphs:
            text += para.text + "\n"
    except Exception as e:
        print(f"Error reading DOCX: {e}")
    return text

def chunk_text(text, max_words=150):
    import re
    # Split text into paragraphs or sentences to preserve semantic boundaries
    sentences = re.split(r'(?<=[.!?])\s+', text)
    
    chunks = []
    current_chunk = []
    current_length = 0
    
    for sentence in sentences:
        sentence = sentence.strip()
        if not sentence: continue
        
        words = sentence.split()
        if current_length + len(words) > max_words and current_chunk:
            chunks.append(" ".join(current_chunk))
            current_chunk = [sentence]
            current_length = len(words)
        else:
            current_chunk.append(sentence)
            current_length += len(words)
            
    if current_chunk:
        chunks.append(" ".join(current_chunk))
        
    return chunks

def process_and_store_document(study_material_id, file_path, file_type):
    if file_type == 'pdf':
        text = extract_text_from_pdf(file_path)
    elif file_type == 'docx':
        text = extract_text_from_docx(file_path)
    else:
        return False
        
    if not text.strip():
        return False
        
    chunks = chunk_text(text)
    
    for idx, chunk_text_data in enumerate(chunks):
        chunk = DocumentChunk(
            study_material_id=study_material_id,
            chunk_index=idx,
            chunk_text=chunk_text_data
        )
        db.session.add(chunk)
        
    db.session.commit()
    return True
