from app import create_app
from database.models import db
from database.seed_data import seed_database
import webbrowser
import threading
import time

app = create_app()

def open_browser():
    # Wait a second to allow the server to start before opening browser
    time.sleep(1.5)
    webbrowser.open_new("http://localhost:3000/")

if __name__ == '__main__':
    with app.app_context():
        # Initialize DB and seed if needed
        db.create_all()
        seed_database(db)
        
    # Use Waitress for production-like Windows execution
    from waitress import serve
    print("Starting server on http://127.0.0.1:5000")
    
    # Automatically open browser (useful for students testing the build)
    threading.Thread(target=open_browser).start()
    
    serve(app, host='127.0.0.1', port=5000)
