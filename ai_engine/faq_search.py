from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from database.models import FAQ

def search_faqs(question):
    faqs = FAQ.query.all()
    if not faqs:
        return None, None
        
    texts = [f.question for f in faqs]
    texts.append(question)
    
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(texts)
    
    cosine_sim = cosine_similarity(tfidf_matrix[-1], tfidf_matrix[:-1])
    best_idx = cosine_sim.argsort()[0][-1]
    best_score = cosine_sim[0][best_idx]
    
    if best_score > 0.3:
        best_faq = faqs[best_idx]
        return best_faq.answer, "Official College FAQ"
        
    return None, None
