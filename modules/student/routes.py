from flask import Blueprint, render_template, request, jsonify
from flask_login import login_required, current_user
from functools import wraps
from database.models import db, ChatSession, ChatMessage
from ai_engine.chatbot import process_chat_message

student_bp = Blueprint('student', __name__)

def student_required(f):
    @wraps(f)
    @login_required
    def decorated_function(*args, **kwargs):
        if current_user.role != 'student':
            return "Access denied. Students only.", 403
        return f(*args, **kwargs)
    return decorated_function

@student_bp.route('/dashboard')
@student_required
def dashboard():
    return render_template('student/dashboard.html')

@student_bp.route('/api/dashboard', methods=['GET'])
@student_required
def api_dashboard():
    student = current_user.student_profile
    from database.models import Assignment, Examination, StudyMaterial, Announcement, Subject
    from datetime import date
    
    # Get student's current subjects
    subjects = [s.id for s in Subject.query.filter_by(course_id=student.course_id, semester=student.semester).all()]
    
    # Upcoming Assignments
    assignments = Assignment.query.filter(Assignment.subject_id.in_(subjects)).filter(Assignment.due_date >= date.today()).limit(3).all()
    
    # Upcoming Examinations
    exams = Examination.query.filter(Examination.subject_id.in_(subjects)).filter(Examination.exam_date >= date.today()).limit(3).all()
    
    # Recent Study Materials
    materials = StudyMaterial.query.filter(StudyMaterial.subject_id.in_(subjects)).order_by(StudyMaterial.uploaded_at.desc()).limit(3).all()
    
    # Latest Announcements
    announcements = Announcement.query.filter(
        (Announcement.target_course_id == None) | (Announcement.target_course_id == student.course_id)
    ).order_by(Announcement.published_at.desc()).limit(3).all()
    
    return jsonify({
        'student': {
            'name': student.full_name,
            'roll': student.student_roll_number,
            'course': student.course_id,
            'semester': student.semester
        },
        'stats': {
            'active_assignments': len(assignments),
            'upcoming_exams': len(exams),
            'new_materials': len(materials)
        },
        'assignments': [{'id': a.id, 'title': a.title, 'due_date': str(a.due_date)} for a in assignments],
        'exams': [{'id': e.id, 'exam_type': e.exam_type, 'date': str(e.exam_date)} for e in exams],
        'materials': [{'id': m.id, 'title': m.title, 'type': m.file_type} for m in materials],
        'announcements': [{'id': a.id, 'title': a.title, 'desc': a.description} for a in announcements]
    })

@student_bp.route('/api/chat', methods=['POST'])
@student_required
def chat_api():
    data = request.json
    question = data.get('question')
    if not question:
        return jsonify({'error': 'No question provided'}), 400
        
    answer, source = process_chat_message(current_user.student_profile.id, question)
    return jsonify({'answer': answer, 'source': source})
