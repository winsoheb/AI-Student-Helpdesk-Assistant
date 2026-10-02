from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_login import login_required, current_user
from functools import wraps
from database.models import db, User, Department, Course, Subject, Student, FAQ
from werkzeug.security import generate_password_hash

admin_bp = Blueprint('admin', __name__)

def admin_required(f):
    @wraps(f)
    @login_required
    def decorated_function(*args, **kwargs):
        if current_user.role != 'admin':
            return "Access denied. Admins only.", 403
        return f(*args, **kwargs)
    return decorated_function

@admin_bp.route('/dashboard')
@admin_required
def dashboard():
    stats = {
        'students': Student.query.count(),
        'departments': Department.query.count(),
        'courses': Course.query.count(),
        'subjects': Subject.query.count(),
        'faqs': FAQ.query.count()
    }
    return render_template('admin/dashboard.html', stats=stats)

@admin_bp.route('/api/dashboard', methods=['GET'])
@admin_required
def api_dashboard():
    from database.models import ChatSession, StudyMaterial
    
    stats = {
        'students': Student.query.count(),
        'departments': Department.query.count(),
        'courses': Course.query.count(),
        'subjects': Subject.query.count(),
        'faqs': FAQ.query.count(),
        'materials': StudyMaterial.query.count(),
        'chat_sessions': ChatSession.query.count()
    }
    
    # Mock data for Recharts (since we don't have historical data in models easily queriable without complexity)
    activity_data = [
        {"name": "Mon", "queries": 12, "uploads": 2},
        {"name": "Tue", "queries": 19, "uploads": 1},
        {"name": "Wed", "queries": 3, "uploads": 4},
        {"name": "Thu", "queries": 15, "uploads": 0},
        {"name": "Fri", "queries": 22, "uploads": 5},
        {"name": "Sat", "queries": 30, "uploads": 0},
        {"name": "Sun", "queries": 25, "uploads": 1}
    ]
    
    return {'stats': stats, 'activity': activity_data}

# --- DEPARTMENTS ---
@admin_bp.route('/departments', methods=['GET', 'POST'])
@admin_required
def departments():
    if request.method == 'POST':
        action = request.form.get('action')
        if action == 'add':
            name = request.form.get('department_name')
            code = request.form.get('department_code')
            desc = request.form.get('description')
            new_dept = Department(department_name=name, department_code=code, description=desc)
            db.session.add(new_dept)
            db.session.commit()
            flash('Department added.', 'success')
        elif action == 'delete':
            dept_id = request.form.get('id')
            dept = Department.query.get(dept_id)
            if dept:
                db.session.delete(dept)
                db.session.commit()
                flash('Department deleted.', 'success')
        return redirect(url_for('admin.departments'))
        
    depts = Department.query.all()
    return render_template('admin/departments.html', departments=depts)

# --- COURSES ---
@admin_bp.route('/courses', methods=['GET', 'POST'])
@admin_required
def courses():
    if request.method == 'POST':
        action = request.form.get('action')
        if action == 'add':
            dept_id = request.form.get('department_id')
            name = request.form.get('course_name')
            code = request.form.get('course_code')
            duration = request.form.get('duration_years')
            new_course = Course(department_id=dept_id, course_name=name, course_code=code, duration_years=duration)
            db.session.add(new_course)
            db.session.commit()
            flash('Course added.', 'success')
        elif action == 'delete':
            course_id = request.form.get('id')
            course = Course.query.get(course_id)
            if course:
                db.session.delete(course)
                db.session.commit()
                flash('Course deleted.', 'success')
        return redirect(url_for('admin.courses'))
        
    courses = Course.query.all()
    departments = Department.query.all()
    return render_template('admin/courses.html', courses=courses, departments=departments)

# --- SUBJECTS ---
@admin_bp.route('/subjects', methods=['GET', 'POST'])
@admin_required
def subjects():
    if request.method == 'POST':
        action = request.form.get('action')
        if action == 'add':
            course_id = request.form.get('course_id')
            name = request.form.get('subject_name')
            code = request.form.get('subject_code')
            sem = request.form.get('semester')
            desc = request.form.get('description')
            new_subj = Subject(course_id=course_id, subject_name=name, subject_code=code, semester=sem, description=desc)
            db.session.add(new_subj)
            db.session.commit()
            flash('Subject added.', 'success')
        elif action == 'delete':
            subj_id = request.form.get('id')
            subj = Subject.query.get(subj_id)
            if subj:
                db.session.delete(subj)
                db.session.commit()
                flash('Subject deleted.', 'success')
        return redirect(url_for('admin.subjects'))
        
    subjects = Subject.query.all()
    courses = Course.query.all()
    return render_template('admin/subjects.html', subjects=subjects, courses=courses)

# --- STUDENTS ---
@admin_bp.route('/students', methods=['GET', 'POST'])
@admin_required
def students():
    if request.method == 'POST':
        action = request.form.get('action')
        if action == 'add':
            roll = request.form.get('student_roll_number')
            name = request.form.get('full_name')
            dept_id = request.form.get('department_id')
            course_id = request.form.get('course_id')
            sem = request.form.get('semester')
            year = request.form.get('admission_year')
            
            user = User(username=roll, password_hash=generate_password_hash(roll), role='student')
            db.session.add(user)
            db.session.commit()
            
            new_student = Student(
                user_id=user.id,
                student_roll_number=roll,
                full_name=name,
                department_id=dept_id,
                course_id=course_id,
                semester=sem,
                admission_year=year
            )
            db.session.add(new_student)
            db.session.commit()
            flash('Student added. Password is roll number.', 'success')
        elif action == 'delete':
            student_id = request.form.get('id')
            student = Student.query.get(student_id)
            if student:
                user = User.query.get(student.user_id)
                db.session.delete(student)
                db.session.delete(user)
                db.session.commit()
                flash('Student deleted.', 'success')
        return redirect(url_for('admin.students'))
        
    students = Student.query.all()
    departments = Department.query.all()
    courses = Course.query.all()
    return render_template('admin/students.html', students=students, departments=departments, courses=courses)

# --- FAQS ---
@admin_bp.route('/faqs', methods=['GET', 'POST'])
@admin_required
def faqs():
    if request.method == 'POST':
        action = request.form.get('action')
        if action == 'add':
            q = request.form.get('question')
            a = request.form.get('answer')
            cat = request.form.get('category')
            new_faq = FAQ(question=q, answer=a, category=cat)
            db.session.add(new_faq)
            db.session.commit()
            flash('FAQ added.', 'success')
        elif action == 'delete':
            faq_id = request.form.get('id')
            faq = FAQ.query.get(faq_id)
            if faq:
                db.session.delete(faq)
                db.session.commit()
                flash('FAQ deleted.', 'success')
        return redirect(url_for('admin.faqs'))
        
    faqs = FAQ.query.all()
    return render_template('admin/faqs.html', faqs=faqs)
