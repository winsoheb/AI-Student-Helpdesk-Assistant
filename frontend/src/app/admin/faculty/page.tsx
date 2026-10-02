'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminFacultyPage() {
  const [faculty, setFaculty] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    department_id: '',
    designation: '',
    contact_number: ''
  });

  const fetchData = async () => {
    try {
      const [facRes, deptRes] = await Promise.all([
        fetch('http://localhost:5000/api/v1/admin/faculty', { credentials: 'include' }),
        fetch('http://localhost:5000/api/v1/admin/departments', { credentials: 'include' })
      ]);
      const [facData, deptData] = await Promise.all([facRes.json(), deptRes.json()]);
      setFaculty(facData);
      setDepartments(deptData);
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
    await fetch('http://localhost:5000/api/v1/admin/faculty', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
      credentials: 'include'
    });
    
    setIsModalOpen(false);
    setFormData({ name: '', department_id: '', designation: '', contact_number: '' });
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to remove this faculty member?')) return;
    await fetch('http://localhost:5000/api/v1/admin/faculty', {
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
          <h1 className="text-2xl font-bold text-foreground">Manage Faculty</h1>
          <p className="text-muted-foreground text-sm">Add and remove teaching staff</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 flex items-center transition-opacity"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Faculty
        </button>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-4">Faculty ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Designation</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading faculty...
                  </td>
                </tr>
              ) : faculty.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    <Briefcase className="w-8 h-8 mx-auto mb-3 opacity-20" />
                    No faculty found.
                  </td>
                </tr>
              ) : (
                faculty.map((f, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-foreground">{f.faculty_id}</td>
                    <td className="px-6 py-4 font-medium text-foreground">{f.name}</td>
                    <td className="px-6 py-4 text-foreground">{f.designation || '-'}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                        {f.department}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDelete(f.id)} className="text-red-500 hover:text-red-600 p-1">
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

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card rounded-xl max-w-md w-full shadow-xl overflow-hidden border border-border"
            >
              <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/50">
                <h3 className="font-semibold text-foreground">Add New Faculty</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">✕</button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border border-border rounded-lg bg-background text-foreground outline-none focus:ring-2 focus:ring-primary" placeholder="Dr. Jane Smith" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Department</label>
                  <select required value={formData.department_id} onChange={e => setFormData({...formData, department_id: e.target.value})} className="w-full p-2 border border-border rounded-lg bg-background text-foreground outline-none focus:ring-2 focus:ring-primary">
                    <option value="">Select Department</option>
                    {departments.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Designation</label>
                    <input type="text" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} className="w-full p-2 border border-border rounded-lg bg-background text-foreground outline-none focus:ring-2 focus:ring-primary" placeholder="Professor" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Contact No.</label>
                    <input type="text" value={formData.contact_number} onChange={e => setFormData({...formData, contact_number: e.target.value})} className="w-full p-2 border border-border rounded-lg bg-background text-foreground outline-none focus:ring-2 focus:ring-primary" placeholder="1234567890" />
                  </div>
                </div>
                
                <div className="pt-4 flex space-x-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 border border-border text-foreground rounded-lg hover:bg-muted font-medium transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 font-medium transition-opacity">Add Faculty</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
