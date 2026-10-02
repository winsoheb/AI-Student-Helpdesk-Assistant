from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from database.models import db, Department, Course, Subject, Student, FAQ, Assignment, Examination, Timetable, Announcement, StudyMaterial, ChatSession, ChatMessage, User
from datetime import date

api_bp = Blueprint('api_v1', __name__, url_prefix='/api/v1')

# ==========================================
# STUDENT APIs
# ==========================================
@api_bp.route('/student/assignments', methods=['GET'])
@login_required
def student_assignments():
    if current_user.role != 'student': return jsonify({'error': 'Unauthorized'}), 403
    student = current_user.student_profile
    subjects = [s.id for s in Subject.query.filter_by(course_id=student.course_id, semester=student.semester).all()]
    assignments = Assignment.query.filter(Assignment.subject_id.in_(subjects)).all()
    return jsonify([{'id': a.id, 'subject': Subject.query.get(a.subject_id).subject_name, 'title': a.title, 'desc': a.description, 'due_date': str(a.due_date), 'marks': a.maximum_marks, 'status': a.status} for a in assignments])

@api_bp.route('/student/materials', methods=['GET'])
@login_required
def student_materials():
    if current_user.role != 'student': return jsonify({'error': 'Unauthorized'}), 403
    student = current_user.student_profile
    subjects = [s.id for s in Subject.query.filter_by(course_id=student.course_id, semester=student.semester).all()]
    materials = StudyMaterial.query.filter(StudyMaterial.subject_id.in_(subjects)).all()
    return jsonify([{'id': m.id, 'subject': Subject.query.get(m.subject_id).subject_name, 'title': m.title, 'desc': m.description, 'type': m.file_type} for m in materials])

@api_bp.route('/student/timetable', methods=['GET'])
@login_required
def student_timetable():
    if current_user.role != 'student': return jsonify({'error': 'Unauthorized'}), 403
    student = current_user.student_profile
    tt = Timetable.query.filter_by(course_id=student.course_id, semester=student.semester).all()
    dept_name = Department.query.get(student.department_id).department_code if student.department_id else ''
    return jsonify([{'id': t.id, 'department': dept_name, 'subject': Subject.query.get(t.subject_id).subject_name, 'weekday': t.weekday, 'start': str(t.start_time), 'end': str(t.end_time), 'faculty': t.faculty_name, 'room': t.classroom} for t in tt])

@api_bp.route('/student/announcements', methods=['GET'])
@login_required
def student_announcements():
    if current_user.role != 'student': return jsonify({'error': 'Unauthorized'}), 403
    student = current_user.student_profile
    ann = Announcement.query.filter((Announcement.target_course_id == None) | (Announcement.target_course_id == student.course_id)).order_by(Announcement.published_at.desc()).all()
    return jsonify([{'id': a.id, 'title': a.title, 'desc': a.description, 'date': str(a.published_at.date())} for a in ann])

@api_bp.route('/student/profile', methods=['GET', 'PUT'])
@login_required
def student_profile():
    if current_user.role != 'student': return jsonify({'error': 'Unauthorized'}), 403
    student = current_user.student_profile
    
    if request.method == 'PUT':
        data = request.json
        if 'full_name' in data: student.full_name = data['full_name']
        if 'address' in data: student.address = data['address']
        if 'profile_photo' in data: student.profile_photo = data['profile_photo']
        db.session.commit()
        return jsonify({'message': 'Profile updated successfully'})
        
    course = Course.query.get(student.course_id)
    department = Department.query.get(student.department_id)

    return jsonify({
        'roll_number': student.student_roll_number,
        'full_name': student.full_name,
        'address': student.address or '',
        'profile_photo': student.profile_photo or '',
        'admission_year': student.admission_year,
        'semester': student.semester,
        'course': course.course_name if course else '',
        'department': department.department_name if department else ''
    })

# ==========================================
# ADMIN APIs
# ==========================================
@api_bp.route('/admin/students', methods=['GET', 'POST', 'DELETE'])
@login_required
def admin_students():
    if current_user.role != 'admin': return jsonify({'error': 'Unauthorized'}), 403
    if request.method == 'POST':
        data = request.json
        from werkzeug.security import generate_password_hash
        
        # Auto-generate Roll Number: <Year><DeptCode><Sequence>
        dept = Department.query.get(data['department_id'])
        if not dept: return jsonify({'error': 'Invalid department'}), 400
        year = data['year']
        count = Student.query.filter_by(admission_year=year, department_id=dept.id).count()
        roll_number = f"{year}{dept.department_code}{(count + 1):03d}"
        
        user = User(username=roll_number, password_hash=generate_password_hash(roll_number), role='student')
        db.session.add(user)
        db.session.commit()
        s = Student(user_id=user.id, student_roll_number=roll_number, full_name=data['name'], department_id=data['department_id'], course_id=data['course_id'], semester=data['semester'], admission_year=year, address=data.get('address'), contact_number=data.get('contact_number'))
        db.session.add(s)
        db.session.commit()
        return jsonify({'message': 'Added'})
    elif request.method == 'DELETE':
        data = request.json
        s = Student.query.get(data['id'])
        if s:
            u = User.query.get(s.user_id)
            db.session.delete(s)
            if u: db.session.delete(u)
            db.session.commit()
        return jsonify({'message': 'Deleted'})
        
    students = Student.query.all()
    return jsonify([{'id': s.id, 'roll_number': s.student_roll_number, 'name': s.full_name, 'semester': s.semester, 'department': Department.query.get(s.department_id).department_code if Department.query.get(s.department_id) else ''} for s in students])

@api_bp.route('/admin/departments', methods=['GET', 'POST', 'DELETE'])
@login_required
def admin_departments():
    if current_user.role != 'admin': return jsonify({'error': 'Unauthorized'}), 403
    if request.method == 'POST':
        data = request.json
        d = Department(department_name=data['name'], department_code=data['code'], description=data.get('description', ''))
        db.session.add(d)
        db.session.commit()
        return jsonify({'message': 'Added'})
    elif request.method == 'DELETE':
        d = Department.query.get(request.json['id'])
        if d: 
            db.session.delete(d)
            db.session.commit()
        return jsonify({'message': 'Deleted'})
        
    depts = Department.query.all()
    return jsonify([{'id': d.id, 'name': d.department_name, 'code': d.department_code, 'description': d.description} for d in depts])

@api_bp.route('/admin/courses', methods=['GET'])
@login_required
def admin_courses():
    if current_user.role != 'admin': return jsonify({'error': 'Unauthorized'}), 403
    courses = Course.query.all()
    return jsonify([{'id': c.id, 'name': c.course_name, 'code': c.course_code} for c in courses])

@api_bp.route('/admin/subjects', methods=['GET', 'POST', 'DELETE'])
@login_required
def admin_subjects():
    if current_user.role != 'admin': return jsonify({'error': 'Unauthorized'}), 403
    if request.method == 'POST':
        data = request.json
        s = Subject(course_id=data['course_id'], subject_name=data['name'], subject_code=data['code'], semester=data['semester'], description=data.get('description', ''))
        db.session.add(s)
        db.session.commit()
        return jsonify({'message': 'Added'})
    elif request.method == 'DELETE':
        s = Subject.query.get(request.json['id'])
        if s: 
            db.session.delete(s)
            db.session.commit()
        return jsonify({'message': 'Deleted'})
        
    subs = Subject.query.all()
    return jsonify([{'id': s.id, 'course': Course.query.get(s.course_id).course_name if Course.query.get(s.course_id) else '', 'name': s.subject_name, 'code': s.subject_code, 'semester': s.semester} for s in subs])


@api_bp.route('/admin/faqs', methods=['GET', 'POST', 'DELETE'])
@login_required
def admin_faqs():
    if current_user.role != 'admin': return jsonify({'error': 'Unauthorized'}), 403
    if request.method == 'POST':
        data = request.json
        f = FAQ(question=data['question'], answer=data['answer'], category='General')
        db.session.add(f)
        db.session.commit()
        return jsonify({'message': 'Added'})
    elif request.method == 'DELETE':
        f = FAQ.query.get(request.json['id'])
        if f: 
            db.session.delete(f)
            db.session.commit()
        return jsonify({'message': 'Deleted'})
        
    faqs = FAQ.query.all()
    return jsonify([{'id': f.id, 'question': f.question, 'answer': f.answer} for f in faqs])

@api_bp.route('/admin/assignments', methods=['GET', 'POST', 'DELETE'])
@login_required
def admin_assignments():
    if current_user.role != 'admin': return jsonify({'error': 'Unauthorized'}), 403
    if request.method == 'POST':
        data = request.json
        from datetime import datetime
        due = datetime.strptime(data['due_date'], '%Y-%m-%d').date()
        a = Assignment(title=data['title'], description=data['description'], subject_id=data['subject_id'], issue_date=date.today(), due_date=due, maximum_marks=data['marks'], status='published')
        db.session.add(a)
        db.session.commit()
        return jsonify({'message': 'Added'})
    elif request.method == 'DELETE':
        a = Assignment.query.get(request.json['id'])
        if a: 
            db.session.delete(a)
            db.session.commit()
        return jsonify({'message': 'Deleted'})
        
    assignments = Assignment.query.order_by(Assignment.id.desc()).all()
    return jsonify([{'id': a.id, 'subject': Subject.query.get(a.subject_id).subject_name if Subject.query.get(a.subject_id) else '', 'title': a.title, 'desc': a.description, 'due_date': str(a.due_date), 'marks': a.maximum_marks, 'status': a.status} for a in assignments])

@api_bp.route('/admin/materials', methods=['GET', 'POST', 'DELETE'])
@login_required
def admin_materials():
    if current_user.role != 'admin': return jsonify({'error': 'Unauthorized'}), 403
    if request.method == 'POST':
        import os
        import uuid
        from werkzeug.utils import secure_filename
        from config import Config
        
        title = request.form.get('title')
        description = request.form.get('description')
        subject_id = request.form.get('subject_id')
        file = request.files.get('file')
        
        if not file: return jsonify({'error': 'No file uploaded'}), 400
        
        filename = secure_filename(file.filename)
        file_ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
        stored_filename = f"{uuid.uuid4().hex}_{filename}"
        filepath = os.path.join(Config.UPLOAD_FOLDER, stored_filename)
        file.save(filepath)
        
        m = StudyMaterial(title=title, description=description, original_filename=filename, stored_filename=stored_filename, file_type=file_ext, file_path=filepath, subject_id=subject_id, uploaded_by=current_user.id)
        db.session.add(m)
        db.session.commit()
        
        try:
            from ai_engine.document_processor import process_and_store_document
            process_and_store_document(m.id, filepath, file_ext)
        except Exception as e:
            print("AI Processing failed:", e)
            
        return jsonify({'message': 'Added'})
    elif request.method == 'DELETE':
        m = StudyMaterial.query.get(request.json['id'])
        if m: 
            db.session.delete(m)
            db.session.commit()
        return jsonify({'message': 'Deleted'})
        
    materials = StudyMaterial.query.order_by(StudyMaterial.id.desc()).all()
    return jsonify([{'id': m.id, 'subject': Subject.query.get(m.subject_id).subject_name if Subject.query.get(m.subject_id) else '', 'title': m.title, 'type': m.file_type} for m in materials])

@api_bp.route('/admin/timetable', methods=['GET', 'POST', 'DELETE'])
@login_required
def admin_timetable_crud():
    if current_user.role != 'admin': return jsonify({'error': 'Unauthorized'}), 403
    if request.method == 'POST':
        data = request.json
        from datetime import datetime
        start = datetime.strptime(data['start_time'], '%H:%M').time()
        end = datetime.strptime(data['end_time'], '%H:%M').time()
        t = Timetable(course_id=data['course_id'], subject_id=data['subject_id'], semester=data['semester'], weekday=data['weekday'], start_time=start, end_time=end, faculty_name=data['faculty'], classroom=data['room'])
        db.session.add(t)
        db.session.commit()
        return jsonify({'message': 'Added'})
    elif request.method == 'DELETE':
        t = Timetable.query.get(request.json['id'])
        if t: 
            db.session.delete(t)
            db.session.commit()
        return jsonify({'message': 'Deleted'})
        
    tt = Timetable.query.order_by(Timetable.id.desc()).all()
    return jsonify([{'id': t.id, 'subject': Subject.query.get(t.subject_id).subject_name if Subject.query.get(t.subject_id) else '', 'weekday': t.weekday, 'time': f"{t.start_time} - {t.end_time}", 'faculty': t.faculty_name, 'room': t.classroom} for t in tt])
@api_bp.route('/admin/dashboard', methods=['GET'])
@login_required
def admin_dashboard():
    if current_user.role != 'admin': return jsonify({'error': 'Unauthorized'}), 403
    
    total_students = Student.query.count()
    total_materials = StudyMaterial.query.count()
    total_chats = ChatSession.query.count()
    total_faqs = FAQ.query.count()
    
    from datetime import datetime, timedelta
    today = date.today()
    ai_trends = []
    uploads = []
    
    # 7-day rolling window
    for i in range(6, -1, -1):
        d = today - timedelta(days=i)
        day_str = d.strftime('%a')
        
        # Count AI queries (messages from students)
        day_msgs = ChatMessage.query.filter(ChatMessage.sender == 'student').filter(db.func.date(ChatMessage.created_at) == d).count()
        ai_trends.append({'name': day_str, 'queries': day_msgs})
        
        # Count study material uploads
        day_mats = StudyMaterial.query.filter(db.func.date(StudyMaterial.uploaded_at) == d).count()
        uploads.append({'name': day_str, 'uploads': day_mats})
        
    dept_stats = []
    for dept in Department.query.all():
        count = Student.query.filter_by(department_id=dept.id).count()
        dept_stats.append({'name': dept.department_code, 'students': count})
        
    return jsonify({
        'total_students': total_students,
        'total_materials': total_materials,
        'total_chats': total_chats,
        'total_faqs': total_faqs,
        'ai_trends': ai_trends,
        'weekly_uploads': uploads,
        'department_stats': dept_stats
    })
