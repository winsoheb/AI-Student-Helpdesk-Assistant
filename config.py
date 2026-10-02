import os
import sys
from pathlib import Path

# Determine base directory
if getattr(sys, 'frozen', False):
    # If running as PyInstaller executable
    BASE_DIR = Path(sys.executable).parent
    # Use LOCALAPPDATA for data to survive updates/reinstalls
    appdata = os.environ.get('LOCALAPPDATA', str(BASE_DIR))
    USER_DATA_DIR = Path(appdata) / "AI-Student-Helpdesk"
else:
    # If running in development
    BASE_DIR = Path(__file__).resolve().parent
    USER_DATA_DIR = BASE_DIR / "user_data"

DB_DIR = USER_DATA_DIR / "database"
UPLOAD_DIR = USER_DATA_DIR / "uploads"

# Ensure directories exist
DB_DIR.mkdir(parents=True, exist_ok=True)
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'super-secret-college-key-replace-in-production'
    SQLALCHEMY_DATABASE_URI = f'sqlite:///{DB_DIR / "helpdesk.db"}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    UPLOAD_FOLDER = str(UPLOAD_DIR)
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB limit
