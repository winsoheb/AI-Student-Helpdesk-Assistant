'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';

export default function StudentsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [depts, setDepts] = useState([]);
  const [courses, setCourses] = useState([]);
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  
  const [name, setName] = useState('');
  const [roll, setRoll] = useState('');
  const [deptId, setDeptId] = useState(1);
  const [courseId, setCourseId] = useState(1);
  const [semester, setSemester] = useState(1);
  const [year, setYear] = useState(2023);

  const fetchData = async () => {
    try {
      const [stuRes, depRes, couRes] = await Promise.all([
        fetch('http://localhost:5000/api/v1/admin/students', { credentials: 'include' }).then(r => r.json()),
        fetch('http://localhost:5000/api/v1/admin/departments', { credentials: 'include' }).then(r => r.json()),
        fetch('http://localhost:5000/api/v1/admin/courses', { credentials: 'include' }).then(r => r.json())
      ]);
      setData(stuRes.error ? [] : stuRes);
      setDepts(depRes.error ? [] : depRes);
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
    await fetch('http://localhost:5000/api/v1/admin/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ 
        name: `${firstName} ${lastName}`.trim(), 
        address,
        contact_number: contact,
        department_id: deptId,
        course_id: courseId,
        semester,
        year
      })
    });
    setFirstName(''); setLastName(''); setAddress(''); setContact(''); setIsAdding(false);
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if(!confirm("Are you sure? This will delete the student and their account.")) return;
    await fetch('http://localhost:5000/api/v1/admin/students', {
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
        <h2 className="text-2xl font-bold text-foreground">Students</h2>
        <button onClick={() => setIsAdding(!isAdding)} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4 mr-2" /> Add Student
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="mb-8 bg-background p-4 rounded-xl border border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <input required placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} className="border p-2 rounded-lg" />
            <input required placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} className="border p-2 rounded-lg" />
            <input placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} className="border p-2 rounded-lg" />
            <input placeholder="Contact Details" value={contact} onChange={e => setContact(e.target.value)} className="border p-2 rounded-lg" />
            
            <select required value={deptId} onChange={e => setDeptId(Number(e.target.value))} className="border p-2 rounded-lg bg-card">
              <option value={0} disabled>Select Department</option>
              {depts.map((d: any) => <option key={d.id} value={d.id}>{d.name} ({d.code})</option>)}
            </select>
            
            <select required value={courseId} onChange={e => setCourseId(Number(e.target.value))} className="border p-2 rounded-lg bg-card">
              <option value={0} disabled>Select Course</option>
              {courses.map((c: any) => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
            </select>
            
            <select required value={semester} onChange={e => setSemester(Number(e.target.value))} className="border p-2 rounded-lg bg-card">
              <option value={0} disabled>Select Semester</option>
              {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
            </select>
            
            <input required type="number" placeholder="Admission Year (e.g. 2023)" value={year} onChange={e => setYear(Number(e.target.value))} className="border p-2 rounded-lg" />
          </div>
          <div className="text-sm text-muted-foreground mb-4 bg-primary/5 p-3 rounded-lg border border-primary/20 flex items-center">
             💡 Roll Number and Student Account will be automatically generated upon save.
          </div>
          <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-lg">Save Student</button>
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
                <th className="px-6 py-3">Roll Number</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Semester</th>
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
                  <td className="px-6 py-4">{row.roll_number}</td>
                  <td className="px-6 py-4">{row.name}</td>
                  <td className="px-6 py-4">{row.department}</td>
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
