# Chapter 13: Viva Preparation

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