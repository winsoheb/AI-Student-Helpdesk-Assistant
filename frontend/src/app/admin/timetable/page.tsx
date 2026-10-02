'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';

export default function AdminTimetablePage() {
  const [data, setData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  const [courseId, setCourseId] = useState(1);
  const [subjectId, setSubjectId] = useState(1);
  const [semester, setSemester] = useState(1);
  const [weekday, setWeekday] = useState('Monday');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [faculty, setFaculty] = useState('');
  const [room, setRoom] = useState('');

  const fetchData = () => {
    fetch('http://localhost:5000/api/v1/admin/timetable', { credentials: 'include' })
      .then(res => res.json())
      .then(d => {
        setData(d.error ? [] : d);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch('http://localhost:5000/api/v1/admin/subjects', { credentials: 'include' })
      .then(res => res.json())
      .then(d => {
        if(!d.error && d.length > 0) {
            setSubjects(d);
            setSubjectId(d[0].id);
        }
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('http://localhost:5000/api/v1/admin/timetable', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ 
        course_id: courseId,
        subject_id: subjectId,
        semester,
        weekday,
        start_time: startTime,
        end_time: endTime,
        faculty,
        room
      })
    });
    setIsAdding(false);
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if(!confirm("Are you sure?")) return;
    await fetch('http://localhost:5000/api/v1/admin/timetable', {
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
        <h2 className="text-2xl font-bold text-foreground">Manage Timetable</h2>
        <button onClick={() => setIsAdding(!isAdding)} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4 mr-2" /> Add Schedule
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="mb-8 bg-background p-4 rounded-xl border border-border">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input required type="number" placeholder="Course ID" value={courseId} onChange={e => setCourseId(Number(e.target.value))} className="border p-2 rounded-lg" />
            <select required value={subjectId} onChange={e => setSubjectId(Number(e.target.value))} className="border p-2 rounded-lg bg-card">
                {subjects.map((sub: any) => <option key={sub.id} value={sub.id}>{sub.name} ({sub.code})</option>)}
            </select>
            <input required type="number" placeholder="Semester" value={semester} onChange={e => setSemester(Number(e.target.value))} className="border p-2 rounded-lg" />
            <select required value={weekday} onChange={e => setWeekday(e.target.value)} className="border p-2 rounded-lg">
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
            </select>
            <input required type="time" placeholder="Start Time" value={startTime} onChange={e => setStartTime(e.target.value)} className="border p-2 rounded-lg" />
            <input required type="time" placeholder="End Time" value={endTime} onChange={e => setEndTime(e.target.value)} className="border p-2 rounded-lg" />
            <input required placeholder="Faculty Name" value={faculty} onChange={e => setFaculty(e.target.value)} className="border p-2 rounded-lg" />
            <input required placeholder="Classroom" value={room} onChange={e => setRoom(e.target.value)} className="border p-2 rounded-lg" />
          </div>
          <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-lg">Save Schedule</button>
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
                <th className="px-6 py-3">Subject</th>
                <th className="px-6 py-3">Weekday</th>
                <th className="px-6 py-3">Time</th>
                <th className="px-6 py-3">Faculty</th>
                <th className="px-6 py-3">Room</th>
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
                  <td className="px-6 py-4">{row.subject}</td>
                  <td className="px-6 py-4 font-semibold text-foreground">{row.weekday}</td>
                  <td className="px-6 py-4 text-emerald-600">{row.time}</td>
                  <td className="px-6 py-4">{row.faculty}</td>
                  <td className="px-6 py-4">{row.room}</td>
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
