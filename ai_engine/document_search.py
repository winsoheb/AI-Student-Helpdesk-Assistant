from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from database.models import DocumentChunk, StudyMaterial

def search_documents(question, subject_ids=None):
    query = DocumentChunk.query.join(StudyMaterial)
    
    chunks = query.all()
    if not chunks:
        return None, None
        
    texts = [c.chunk_text for c in chunks]
    texts.append(question)
    
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(texts)
    
    cosine_sim = cosine_similarity(tfidf_matrix[-1], tfidf_matrix[:-1])[0]
    
    # Get top 5 matches
    top_indices = cosine_sim.argsort()[-5:][::-1]
    
    best_chunk = None
    best_score = 0
    
    for idx in top_indices:
        score = cosine_sim[idx]
        if score < 0.05: continue
        
        text = chunks[idx].chunk_text
        
        # Heuristic to avoid Table of Contents: 
        # If a chunk has many '?' characters but is relatively short, it's likely a list of questions
        q_density = text.count('?') / (len(text.split()) + 1)
        if q_density > 0.05:
            # Penalize TOC heavily
            score = score * 0.2
            
        if score > best_score:
            best_score = score
            best_chunk = chunks[idx]
            
    if best_chunk and best_score > 0.05:
        material = StudyMaterial.query.get(best_chunk.study_material_id)
        
        # Clean up the text for presentation
        ans_text = best_chunk.chunk_text.strip()
        
        # Prefix a conversational marker
        final_answer = f"Based on the uploaded document **{material.title}**:\n\n> {ans_text}\n\n*If this isn't exactly what you're looking for, try rephrasing your question!*"
        return final_answer, material.title
        
    return None, None
