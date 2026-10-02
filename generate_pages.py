import os

FRONTEND_DIR = r"c:\Users\Soheb\Downloads\AZAM\ai_student_helpdesk\frontend\src\app"

pages = {
    'student': [
        ('materials', 'Study Materials', 'api/v1/student/materials', 'title'),
        ('assignments', 'Assignments', 'api/v1/student/assignments', 'title'),
        ('timetable', 'Class Timetable', 'api/v1/student/timetable', 'faculty'),
        ('announcements', 'Announcements', 'api/v1/student/announcements', 'title'),
    ],
    'admin': [
        ('students', 'Student Management', 'api/v1/admin/students', 'name'),
        ('departments', 'Departments', 'api/v1/admin/departments', 'name'),
        ('materials', 'Study Materials', 'api/v1/admin/materials', 'title'),
        ('assignments', 'Assignments', 'api/v1/student/assignments', 'title'), # Re-using student assignments API for demo
        ('timetable', 'Timetable', 'api/v1/student/timetable', 'faculty'),     # Re-using student timetable API for demo
        ('chats', 'Chat Monitoring', 'api/v1/admin/chats', 'date'),
        ('faqs', 'FAQs', 'api/v1/admin/faqs', 'q'),
    ]
}

template = """'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function {ComponentName}Page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/{ApiUrl}', { credentials: 'include' })
      .then(res => res.json())
      .then(d => {
        setData(d.error ? [] : d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">{Title}</h2>
      
      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-16 bg-slate-100 animate-pulse rounded-xl"></div>)}
        </div>
      ) : data.length === 0 ? (
        <p className="text-slate-500">No records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50">
              <tr>
                {Object.keys(data[0] || {}).map(k => (
                  <th key={k} className="px-6 py-3">{k.replace('_', ' ')}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row: any, i: number) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={i} 
                  className="bg-white border-b hover:bg-slate-50"
                >
                  {Object.values(row).map((val: any, j: number) => (
                    <td key={j} className="px-6 py-4 font-medium text-slate-900">{val}</td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
"""

for role, role_pages in pages.items():
    for folder, title, api, main_key in role_pages:
        dir_path = os.path.join(FRONTEND_DIR, role, folder)
        os.makedirs(dir_path, exist_ok=True)
        
        comp_name = folder.capitalize()
        content = template.replace('{ComponentName}', comp_name).replace('{ApiUrl}', api).replace('{Title}', title)
        
        with open(os.path.join(dir_path, 'page.tsx'), 'w') as f:
            f.write(content)

print("All missing Next.js pages generated successfully!")
