# AI Student Helpdesk Assistant

The **AI Student Helpdesk Assistant** is an intelligent, offline-capable college management system and self-service portal. It replaces manual enquiry processes with a fast, modern Extractive QA AI Chatbot. The chatbot processes college-uploaded study materials (PDFs/DOCX) and retrieves exact answers instantly, without relying on paid internet APIs. 

The system also includes full administrative dashboards, student analytics, assignment tracking, and timetable management.

---

## 🛠️ Technology Stack

### Backend
- **Python 3.9+**
- **Flask** (RESTful API framework)
- **SQLite3 & SQLAlchemy** (Relational Database)
- **Scikit-Learn** (TF-IDF & Cosine Similarity for the AI Engine)
- **PyPDF2 & python-docx** (Document processing and extraction)
- **Waitress** (WSGI Production Server)

### Frontend
- **Next.js (React 19)**
- **Tailwind CSS 4** (Utility-first styling)
- **Framer Motion** (Smooth UI animations)
- **Recharts** (Interactive admin analytics charts)
- **Lucide React** (Beautiful icons)

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:
1. **Python 3.9 or higher**: [Download Here](https://www.python.org/downloads/)
2. **Node.js (v18 or higher)**: [Download Here](https://nodejs.org/)

---

## 🚀 How to Start

### 1. Start the Backend Server (Flask)

Open a terminal or PowerShell in the root project directory (`ai_student_helpdesk`) and run the following commands:

```bash
# 1. Create a virtual environment (optional but recommended)
python -m venv venv

# 2. Activate the virtual environment (Windows)
.\venv\Scripts\Activate.ps1
# (If using Mac/Linux, run: source venv/bin/activate)

# 3. Install Python dependencies
pip install -r requirements.txt

# 4. Start the server
python run.py
```
*Note: The SQLite database (`helpdesk.db`) and `uploads/` folder will be auto-generated inside the `user_data/` directory when the server starts.*

---

### 2. Start the Frontend Application (Next.js)

Open a **new** terminal window, navigate to the `frontend` folder inside the project, and run:

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install Node dependencies
npm install

# 3. Start the Next.js development server
npm run dev
```

### 3. Access the Application
Once both servers are running, open your web browser and navigate to:
**👉 http://localhost:3000**

---

## 📚 Documentation
A complete set of academic and technical documentation (including Project Reports, User Manuals, API Documentation, and Viva Questions in PDF, DOCX, and PPTX formats) has been generated and is available in the `/documentation` directory of this project.
