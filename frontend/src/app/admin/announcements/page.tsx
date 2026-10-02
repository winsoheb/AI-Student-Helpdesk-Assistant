'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2, Bell } from 'lucide-react';

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [departments, setDepartments] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department_id: '',
    course_id: ''
  });

  const fetchData = async () => {
    try {
      const [annRes, deptRes, courseRes] = await Promise.all([
        fetch('http://localhost:5000/api/v1/admin/announcements', { credentials: 'include' }),
        fetch('http://localhost:5000/api/v1/admin/departments', { credentials: 'include' }),
        fetch('http://localhost:5000/api/v1/admin/courses', { credentials: 'include' })
      ]);
      const [annData, deptData, courseData] = await Promise.all([
        annRes.json(), deptRes.json(), courseRes.json()
      ]);
      setAnnouncements(annData);
      setDepartments(deptData);
      setCourses(courseData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      department_id: formData.department_id ? parseInt(formData.department_id) : null,
      course_id: formData.course_id ? parseInt(formData.course_id) : null
    };

    await fetch('http://localhost:5000/api/v1/admin/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include'
    });
    
    setIsModalOpen(false);
    setFormData({ title: '', description: '', department_id: '', course_id: '' });
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    await fetch('http://localhost:5000/api/v1/admin/announcements', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
      credentials: 'include'
    });
    fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Announcements</h1>
          <p className="text-muted-foreground text-sm">Post announcements to students</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 flex items-center transition-opacity"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Announcement
        </button>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Target Department</th>
                <th className="px-6 py-4">Target Course</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading announcements...
                  </td>
                </tr>
              ) : announcements.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    <Bell className="w-8 h-8 mx-auto mb-3 opacity-20" />
                    No announcements found.
                  </td>
                </tr>
              ) : (
                announcements.map((a, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{a.title}</div>
                      <div className="text-xs text-muted-foreground mt-1 line-clamp-1">{a.desc}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                        {a.department}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-foreground">{a.course}</td>
                    <td className="px-6 py-4 text-foreground">{a.date}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDelete(a.id)} className="text-red-500 hover:text-red-600 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl max-w-md w-full shadow-xl overflow-hidden border border-border">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center">
              <h3 className="font-semibold text-foreground">Post Announcement</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Description / Content</label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border border-border rounded-lg bg-background text-foreground h-32 focus:ring-2 focus:ring-primary outline-none" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Target Department (Optional)</label>
                  <select value={formData.department_id} onChange={e => setFormData({...formData, department_id: e.target.value})} className="w-full p-2 border border-border rounded-lg bg-background text-foreground outline-none">
                    <option value="">All Departments</option>
                    {departments.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Target Course (Optional)</label>
                  <select value={formData.course_id} onChange={e => setFormData({...formData, course_id: e.target.value})} className="w-full p-2 border border-border rounded-lg bg-background text-foreground outline-none">
                    <option value="">All Courses</option>
                    {courses.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              
              <div className="pt-4 flex space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 border border-border text-foreground rounded-lg hover:bg-muted font-medium transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 font-medium transition-opacity">Post</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
