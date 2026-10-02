from database.models import db, Student, Subject, Examination, Assignment, Timetable, Announcement, ChatSession, ChatMessage
from ai_engine.intent_classifier import classify_intent
from ai_engine.faq_search import search_faqs
from ai_engine.document_search import search_documents

def process_chat_message(student_id, question):
    student = Student.query.get(student_id)
    if not student:
        return "Student not found.", ""
        
    # Get student's subjects for context filtering
    student_subjects = Subject.query.filter_by(course_id=student.course_id, semester=student.semester).all()
    subject_ids = [s.id for s in student_subjects]
    
    intent = classify_intent(question)
    answer = ""
    source = ""
    
    if intent == 'GENERAL_GREETING':
        answer = f"Hello {student.full_name}! How can I help you with your college queries today?"
        
    elif intent == 'EXAM_SCHEDULE':
        exams = Examination.query.filter(Examination.subject_id.in_(subject_ids)).order_by(Examination.exam_date).all()
        if exams:
            answer = "Here are your upcoming examinations:\n"
            for e in exams:
                sub = Subject.query.get(e.subject_id)
                answer += f"- {sub.subject_name} ({e.exam_type}) on {e.exam_date} at {e.start_time.strftime('%H:%M')} in {e.location}\n"
            source = "College Examination Database"
        else:
            answer = "You have no upcoming examinations scheduled."
            
    elif intent == 'ASSIGNMENT':
        assignments = Assignment.query.filter(Assignment.subject_id.in_(subject_ids)).order_by(Assignment.due_date).all()
        if assignments:
            answer = "Here are your assignments:\n"
            for a in assignments:
                sub = Subject.query.get(a.subject_id)
                answer += f"- {a.title} ({sub.subject_name}) due on {a.due_date}\n"
            source = "College Assignment Database"
        else:
            answer = "You have no pending assignments."
            
    elif intent == 'TIMETABLE':
        tt = Timetable.query.filter_by(course_id=student.course_id, semester=student.semester).all()
        if tt:
            answer = "Here is your class schedule:\n"
            for t in tt:
                sub = Subject.query.get(t.subject_id)
                answer += f"- {t.weekday}: {sub.subject_name} with {t.faculty_name} ({t.start_time.strftime('%H:%M')} - {t.end_time.strftime('%H:%M')}) Room {t.classroom}\n"
            source = "College Timetable Database"
        else:
            answer = "No timetable available for your semester."
            
    elif intent == 'ANNOUNCEMENT':
        anns = Announcement.query.filter(
            (Announcement.target_department_id == None) & (Announcement.target_course_id == None) |
            (Announcement.target_department_id == student.department_id) |
            (Announcement.target_course_id == student.course_id)
        ).all()
        if anns:
            answer = "Recent Announcements:\n"
            for a in anns:
                answer += f"- **{a.title}**: {a.description}\n"
            source = "College Announcements"
        else:
            answer = "No recent announcements."
            
    elif intent == 'SUBJECTS':
        q = question.lower()
        target_sem = student.semester
        if 'next' in q:
            target_sem += 1
        elif 'previous' in q or 'last' in q:
            target_sem -= 1
        
        subs = Subject.query.filter_by(course_id=student.course_id, semester=target_sem).all()
        if subs:
            answer = f"There are {len(subs)} subjects in Semester {target_sem}:\n"
            for s in subs:
                answer += f"- **{s.subject_name}** ({s.subject_code})\n"
            source = "College Subjects Database"
        else:
            answer = f"I couldn't find any subjects listed for Semester {target_sem} yet."
            
    else:
        # Fallback to FAQs first
        faq_ans, faq_src = search_faqs(question)
        if faq_ans:
            answer, source = faq_ans, faq_src
        else:
            # Then check Study Materials via TF-IDF
            doc_ans, doc_src = search_documents(question, subject_ids)
            if doc_ans:
                answer = doc_ans
                source = doc_src
            else:
                answer = "I couldn't find verified information about this in the college knowledge base. Please contact the college administration."
                
    # Save conversation
    session = ChatSession.query.filter_by(student_id=student_id).order_by(ChatSession.id.desc()).first()
    if not session:
        session = ChatSession(student_id=student_id, session_title="General Chat")
        db.session.add(session)
        db.session.commit()
        
    msg_user = ChatMessage(session_id=session.id, sender='student', message=question, intent=intent)
    msg_bot = ChatMessage(session_id=session.id, sender='bot', message=answer)
    db.session.add_all([msg_user, msg_bot])
    db.session.commit()
    
    return answer, source
