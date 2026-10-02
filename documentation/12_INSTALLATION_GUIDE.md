# Chapter 12: Installation and Deployment

## Prerequisites
- Python 3.9+
- Node.js v18+

## Backend Setup
1. Open PowerShell and navigate to the root directory.
2. Create virtual environment: `python -m venv venv`
3. Activate it: `.\venv\Scripts\Activate.ps1`
4. Install dependencies: `pip install -r requirements.txt`
5. Run server: `python run.py`. The SQLite database (`helpdesk.db`) and `uploads/` folder will be auto-generated in `user_data/`.

## Frontend Setup
1. Navigate to the `frontend/` directory.
2. Install dependencies: `npm install`
3. Run dev server: `npm run dev`
4. Open `http://localhost:3000` in your browser.

*Note: The frontend is configured to communicate with the Flask API at `http://localhost:5000`.*