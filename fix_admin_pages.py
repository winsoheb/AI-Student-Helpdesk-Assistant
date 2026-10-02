import os

pages = {
    'faqs': {
        'title': 'FAQs',
        'desc': 'Manage Frequently Asked Questions for the AI Assistant',
        'endpoint': 'api/v1/admin/faqs',
        'schema': [
            "{ name: 'question', label: 'Question', type: 'text' }",
            "{ name: 'answer', label: 'Answer', type: 'textarea' }"
        ]
    },
    'departments': {
        'title': 'Departments',
        'desc': 'Manage College Departments',
        'endpoint': 'api/v1/admin/departments',
        'schema': [
            "{ name: 'name', label: 'Department Name', type: 'text' }",
            "{ name: 'code', label: 'Department Code', type: 'text' }",
            "{ name: 'description', label: 'Description', type: 'textarea' }"
        ]
    },
    'students': {
        'title': 'Student Management',
        'desc': 'Add and manage student accounts',
        'endpoint': 'api/v1/admin/students',
        'schema': [
            "{ name: 'name', label: 'Full Name', type: 'text' }",
            "{ name: 'department_id', label: 'Department', type: 'select', endpoint: 'api/v1/admin/departments' }",
            "{ name: 'course_id', label: 'Course', type: 'select', endpoint: 'api/v1/admin/courses' }",
            "{ name: 'semester', label: 'Semester', type: 'number' }",
            "{ name: 'year', label: 'Admission Year (e.g. 2024)', type: 'number' }"
        ]
    },
    'subjects': {
        'title': 'Subjects',
        'desc': 'Manage course subjects',
        'endpoint': 'api/v1/admin/subjects',
        'schema': [
            "{ name: 'name', label: 'Subject Name', type: 'text' }",
            "{ name: 'code', label: 'Subject Code', type: 'text' }",
            "{ name: 'course_id', label: 'Course', type: 'select', endpoint: 'api/v1/admin/courses' }",
            "{ name: 'semester', label: 'Semester', type: 'number' }"
        ]
    },
    'assignments': {
        'title': 'Assignments',
        'desc': 'Post new assignments for students',
        'endpoint': 'api/v1/admin/assignments',
        'schema': [
            "{ name: 'title', label: 'Assignment Title', type: 'text' }",
            "{ name: 'description', label: 'Description', type: 'textarea' }",
            "{ name: 'subject_id', label: 'Subject', type: 'select', endpoint: 'api/v1/admin/subjects' }",
            "{ name: 'due_date', label: 'Due Date', type: 'date' }",
            "{ name: 'marks', label: 'Maximum Marks', type: 'number' }"
        ]
    },
    'materials': {
        'title': 'Study Materials',
        'desc': 'Upload study materials (PDF/DOCX) for the AI',
        'endpoint': 'api/v1/admin/materials',
        'schema': [
            "{ name: 'title', label: 'Material Title', type: 'text' }",
            "{ name: 'description', label: 'Description', type: 'textarea' }",
            "{ name: 'subject_id', label: 'Subject', type: 'select', endpoint: 'api/v1/admin/subjects' }",
            "{ name: 'file', label: 'Document File (PDF/DOCX)', type: 'file' }"
        ]
    },
    'timetable': {
        'title': 'Class Timetable',
        'desc': 'Manage the weekly class schedule',
        'endpoint': 'api/v1/admin/timetable',
        'schema': [
            "{ name: 'course_id', label: 'Course', type: 'select', endpoint: 'api/v1/admin/courses' }",
            "{ name: 'subject_id', label: 'Subject', type: 'select', endpoint: 'api/v1/admin/subjects' }",
            "{ name: 'semester', label: 'Semester', type: 'number' }",
            "{ name: 'weekday', label: 'Weekday', type: 'select', options: [{value:'Monday',label:'Monday'},{value:'Tuesday',label:'Tuesday'},{value:'Wednesday',label:'Wednesday'},{value:'Thursday',label:'Thursday'},{value:'Friday',label:'Friday'},{value:'Saturday',label:'Saturday'}] }",
            "{ name: 'start_time', label: 'Start Time (HH:MM)', type: 'time' }",
            "{ name: 'end_time', label: 'End Time (HH:MM)', type: 'time' }",
            "{ name: 'faculty', label: 'Faculty Name', type: 'text' }",
            "{ name: 'room', label: 'Classroom', type: 'text' }"
        ]
    }
}

template = """import AdminCrudPage from '@/components/AdminCrudPage';

export default function Page() {
  return (
    <AdminCrudPage 
      title="{title}"
      description="{desc}"
      endpoint="{endpoint}"
      formSchema={[{schema}]}
    />
  );
}
"""

for page, data in pages.items():
    schema_str = ",\n        ".join(data['schema'])
    content = template.replace('{title}', data['title']) \
                      .replace('{desc}', data['desc']) \
                      .replace('{endpoint}', data['endpoint']) \
                      .replace('{schema}', schema_str)
    
    path = f"frontend/src/app/admin/{page}/page.tsx"
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

print("Pages fixed successfully!")
