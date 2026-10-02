import os
from flask import Blueprint, render_template, request, redirect, url_for, flash, current_app
from flask_login import login_required, current_user
from functools import wraps
from werkzeug.utils import secure_filename
from database.models import db, Department, Course, Subject, StudyMaterial, Assignment, Examination, Timetable, Announcement
from ai_engine.document_processor import process_and_store_document
import uuid
import datetime

admin_acad_bp = Blueprint('admin_acad', __name__)

def admin_required(f):
    @wraps(f)
    @login_required
    def decorated_function(*args, **kwargs):
        if current_user.role != 'admin':
            return "Access denied. Admins only.", 403
        return f(*args, **kwargs)
    return decorated_function

# --- STUDY MATERIALS ---
@admin_acad_bp.route('/materials', methods=['GET', 'POST'])
@admin_required
def materials():
    if request.method == 'POST':
        action = request.form.get('action')
        if action == 'add':
            title = request.form.get('title')
            desc = request.form.get('description')
            dept_id = request.form.get('department_id') or None
            course_id = request.form.get('course_id') or None
            subj_id = request.form.get('subject_id') or None
            
            file = request.files.get('file')
            if file and file.filename != '':
                filename = secure_filename(file.filename)
                ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
                
                if ext not in ['pdf', 'docx']:
                    flash('Only PDF and DOCX files are supported.', 'danger')
                    return redirect(url_for('admin_acad.materials'))
                
                stored_filename = f"{uuid.uuid4().hex}_{filename}"
                file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], stored_filename)
                file.save(file_path)
                
                new_mat = StudyMaterial(
                    title=title, description=desc,
                    original_filename=filename, stored_filename=stored_filename,
                    file_type=ext, file_path=file_path,
                    department_id=dept_id, course_id=course_id, subject_id=subj_id,
                    uploaded_by=current_user.id
                )
                db.session.add(new_mat)
                db.session.commit()
                
                success = process_and_store_document(new_mat.id, file_path, ext)
                if success:
                    flash('Material uploaded and indexed for AI search.', 'success')
                else:
                    flash('Material uploaded, but text extraction failed.', 'warning')
                    
        elif action == 'delete':
            mat_id = request.form.get('id')
            mat = StudyMaterial.query.get(mat_id)
            if mat:
                if os.path.exists(mat.file_path):
                    os.remove(mat.file_path)
                db.session.delete(mat) 
                db.session.commit()
                flash('Material deleted.', 'success')
        return redirect(url_for('admin_acad.materials'))
        
    materials = StudyMaterial.query.all()
    departments = Department.query.all()
    courses = Course.query.all()
    subjects = Subject.query.all()
    return render_template('admin/materials.html', materials=materials, departments=departments, courses=courses, subjects=subjects)

# --- ASSIGNMENTS ---
@admin_acad_bp.route('/assignments', methods=['GET', 'POST'])
@admin_required
def assignments():
    if request.method == 'POST':
        action = request.form.get('action')
        if action == 'add':
            title = request.form.get('title')
            desc = request.form.get('description')
            subj_id = request.form.get('subject_id')
            issue_date = datetime.datetime.strptime(request.form.get('issue_date'), '%Y-%m-%d').date()
            due_date = datetime.datetime.strptime(request.form.get('due_date'), '%Y-%m-%d').date()
            marks = request.form.get('maximum_marks')
            
            new_assign = Assignment(title=title, description=desc, subject_id=subj_id, 
                                    issue_date=issue_date, due_date=due_date, maximum_marks=marks)
            db.session.add(new_assign)
            db.session.commit()
            flash('Assignment added.', 'success')
        elif action == 'delete':
            a_id = request.form.get('id')
            a = Assignment.query.get(a_id)
            if a:
                db.session.delete(a)
                db.session.commit()
                flash('Assignment deleted.', 'success')
        return redirect(url_for('admin_acad.assignments'))
        
    assignments = Assignment.query.all()
    subjects = Subject.query.all()
    return render_template('admin/assignments.html', assignments=assignments, subjects=subjects)

# --- EXAMINATIONS ---
@admin_acad_bp.route('/examinations', methods=['GET', 'POST'])
@admin_required
def examinations():
    if request.method == 'POST':
        action = request.form.get('action')
        if action == 'add':
            subj_id = request.form.get('subject_id')
            e_date = datetime.datetime.strptime(request.form.get('exam_date'), '%Y-%m-%d').date()
            s_time = datetime.datetime.strptime(request.form.get('start_time'), '%H:%M').time()
            e_time = datetime.datetime.strptime(request.form.get('end_time'), '%H:%M').time()
            e_type = request.form.get('exam_type')
            loc = request.form.get('location')
            
            new_exam = Examination(subject_id=subj_id, exam_date=e_date, start_time=s_time, end_time=e_time, exam_type=e_type, location=loc)
            db.session.add(new_exam)
            db.session.commit()
            flash('Examination added.', 'success')
        elif action == 'delete':
            e_id = request.form.get('id')
            e = Examination.query.get(e_id)
            if e:
                db.session.delete(e)
                db.session.commit()
                flash('Examination deleted.', 'success')
        return redirect(url_for('admin_acad.examinations'))
        
    examinations = Examination.query.all()
    subjects = Subject.query.all()
    return render_template('admin/examinations.html', examinations=examinations, subjects=subjects)

# --- TIMETABLE ---
@admin_acad_bp.route('/timetable', methods=['GET', 'POST'])
@admin_required
def timetable():
    if request.method == 'POST':
        action = request.form.get('action')
        if action == 'add':
            course_id = request.form.get('course_id')
            subj_id = request.form.get('subject_id')
            sem = request.form.get('semester')
            weekday = request.form.get('weekday')
            s_time = datetime.datetime.strptime(request.form.get('start_time'), '%H:%M').time()
            e_time = datetime.datetime.strptime(request.form.get('end_time'), '%H:%M').time()
            fac = request.form.get('faculty_name')
            room = request.form.get('classroom')
            
            new_tt = Timetable(course_id=course_id, subject_id=subj_id, semester=sem, weekday=weekday,
                               start_time=s_time, end_time=e_time, faculty_name=fac, classroom=room)
            db.session.add(new_tt)
            db.session.commit()
            flash('Timetable entry added.', 'success')
        elif action == 'delete':
            t_id = request.form.get('id')
            t = Timetable.query.get(t_id)
            if t:
                db.session.delete(t)
                db.session.commit()
                flash('Timetable entry deleted.', 'success')
        return redirect(url_for('admin_acad.timetable'))
        
    timetable = Timetable.query.all()
    courses = Course.query.all()
    subjects = Subject.query.all()
    return render_template('admin/timetable.html', timetable=timetable, courses=courses, subjects=subjects)

# --- ANNOUNCEMENTS ---
@admin_acad_bp.route('/announcements', methods=['GET', 'POST'])
@admin_required
def announcements():
    if request.method == 'POST':
        action = request.form.get('action')
        if action == 'add':
            title = request.form.get('title')
            desc = request.form.get('description')
            dept_id = request.form.get('target_department_id') or None
            course_id = request.form.get('target_course_id') or None
            
            new_ann = Announcement(title=title, description=desc, target_department_id=dept_id, target_course_id=course_id)
            db.session.add(new_ann)
            db.session.commit()
            flash('Announcement added.', 'success')
        elif action == 'delete':
            a_id = request.form.get('id')
            a = Announcement.query.get(a_id)
            if a:
                db.session.delete(a)
                db.session.commit()
                flash('Announcement deleted.', 'success')
        return redirect(url_for('admin_acad.announcements'))
        
    announcements = Announcement.query.all()
    departments = Department.query.all()
    courses = Course.query.all()
    return render_template('admin/announcements.html', announcements=announcements, departments=departments, courses=courses)
