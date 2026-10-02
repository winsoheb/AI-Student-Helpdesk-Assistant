'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';

export default function AdminSubjectsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [courses, setCourses] = useState([]);
  
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [courseId, setCourseId] = useState(1);
  const [semester, setSemester] = useState(1);
  const [description, setDescription] = useState('');

  const fetchData = async () => {
    try {
      const [subRes, couRes] = await Promise.all([
        fetch('http://localhost:5000/api/v1/admin/subjects', { credentials: 'include' }).then(r => r.json()),
        fetch('http://localhost:5000/api/v1/admin/courses', { credentials: 'include' }).then(r => r.json())
      ]);
      setData(subRes.error ? [] : subRes);
      setCourses(couRes.error ? [] : couRes);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('http://localhost:5000/api/v1/admin/subjects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ 
        name,
        code,
        course_id: courseId,
        semester,
        description
      })
    });
    setName(''); setCode(''); setIsAdding(false);
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if(!confirm("Are you sure?")) return;
    await fetch('http://localhost:5000/api/v1/admin/subjects', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id })
    });
    fetchData();
  };

  return (
    <div className="bg-card rounded-2xl shadow-sm shadow-border border border-border p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Manage Subjects</h2>
        <button onClick={() => setIsAdding(!isAdding)} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4 mr-2" /> Add Subject
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="mb-8 bg-background p-4 rounded-xl border border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input required placeholder="Subject Name (e.g. Operating Systems)" value={name} onChange={e => setName(e.target.value)} className="border p-2 rounded-lg" />
            <input required placeholder="Subject Code (e.g. CS301)" value={code} onChange={e => setCode(e.target.value)} className="border p-2 rounded-lg" />
            <select required value={courseId} onChange={e => setCourseId(Number(e.target.value))} className="border p-2 rounded-lg bg-card">
              <option value={0} disabled>Select Course</option>
              {courses.map((c: any) => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
            </select>
            <select required value={semester} onChange={e => setSemester(Number(e.target.value))} className="border p-2 rounded-lg bg-card">
              <option value={0} disabled>Select Semester</option>
              {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
            </select>
            <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="border p-2 rounded-lg md:col-span-2" rows={2} />
          </div>
          <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-lg">Save Subject</button>
        </form>
      )}
      
      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-16 bg-muted animate-pulse rounded-xl"></div>)}
        </div>
      ) : data.length === 0 ? (
        <p className="text-muted-foreground">No records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-background">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Code</th>
                <th className="px-6 py-3">Subject Name</th>
                <th className="px-6 py-3">Course</th>
                <th className="px-6 py-3">Sem</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row: any, i: number) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  key={i} className="bg-card border-b hover:bg-background"
                >
                  <td className="px-6 py-4 font-medium text-foreground">{row.id}</td>
                  <td className="px-6 py-4 font-semibold text-foreground">{row.code}</td>
                  <td className="px-6 py-4">{row.name}</td>
                  <td className="px-6 py-4">{row.course}</td>
                  <td className="px-6 py-4">Sem {row.semester}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(row.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4"/></button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
