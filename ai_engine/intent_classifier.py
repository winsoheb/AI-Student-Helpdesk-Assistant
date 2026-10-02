def classify_intent(question):
    q = question.lower()
    
    if any(kw in q for kw in ['exam', 'examination', 'test', 'date sheet']):
        return 'EXAM_SCHEDULE'
    elif any(kw in q for kw in ['assignment', 'submission', 'deadline', 'homework']):
        return 'ASSIGNMENT'
    elif any(kw in q for kw in ['timetable', 'lecture', 'class', 'schedule', 'tomorrow']):
        return 'TIMETABLE'
    elif any(kw in q for kw in ['notice', 'announcement', 'news', 'latest']):
        return 'ANNOUNCEMENT'
    elif any(kw in q for kw in ['notes', 'pdf', 'material', 'document', 'study']):
        return 'STUDY_MATERIAL'
    elif any(kw in q for kw in ['who is', 'hod', 'faculty', 'teacher']):
        return 'FACULTY_INFO'
    elif any(kw in q for kw in ['hi', 'hello', 'hey', 'greetings']):
        return 'GENERAL_GREETING'
    elif any(kw in q for kw in ['subject', 'coursework', 'subjects', 'syllabus']):
        return 'SUBJECTS'
    elif 'explain' in q or 'what is' in q or 'how to' in q or 'difference between' in q:
        return 'ACADEMIC_QUESTION'
    
    return 'UNKNOWN'
