# AI Student Helpdesk Assistant - College Project Documentation

## 1. Project Abstract
The AI Student Helpdesk Assistant is a web-based conversational platform aimed at streamlining information retrieval for college students. Instead of manually navigating through complex college websites or waiting for administration, students can use the chatbot to instantly fetch their exam schedules, assignments, timetables, and academic notes.

## 2. Problem Statement
College students frequently face difficulties tracking dynamic schedules, assignment deadlines, and retrieving specific study materials. Administrative staff is often overwhelmed with redundant inquiries regarding timetables and basic FAQs.

## 3. Proposed System
This project proposes a locally hosted, privacy-first web application featuring a Role-Based Access Control (RBAC) system. An Admin panel manages the knowledge base, while a Student panel provides an AI chatbot interface. The AI utilizes TF-IDF (Term Frequency - Inverse Document Frequency) algorithms to parse and search uploaded PDF/DOCX study materials intelligently.

## 4. Hardware & Software Requirements
**Software:**
- OS: Windows 10/11 (64-bit)
- Language: Python 3.11+
- Frameworks: Flask, Bootstrap 5
- Database: SQLite

**Hardware:**
- RAM: Minimum 4GB (8GB recommended for scikit-learn processing)
- CPU: Intel Core i3 or equivalent

## 5. Technical Architecture
1. **Frontend**: HTML/CSS/JS with Bootstrap 5. Communicates with backend via REST API (`/api/chat`).
2. **Backend**: Flask routing using Blueprints (`auth`, `admin`, `admin_acad`, `student`).
3. **Database Layer**: SQLAlchemy ORM controlling a local SQLite file.
4. **AI Layer**: `PyPDF2` and `python-docx` for document ingestion. `scikit-learn` for NLP vectorization. Waitress WSGI serves the app to handle concurrent requests robustly.
