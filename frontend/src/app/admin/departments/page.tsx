'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Loader2 } from 'lucide-react';

export default function DepartmentsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [desc, setDesc] = useState('');

  const fetchData = () => {
    fetch('http://localhost:5000/api/v1/admin/departments', { credentials: 'include' })
      .then(res => res.json())
      .then(d => {
        setData(d.error ? [] : d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('http://localhost:5000/api/v1/admin/departments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, code, description: desc })
    });
    setName(''); setCode(''); setDesc(''); setIsAdding(false);
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if(!confirm("Are you sure?")) return;
    await fetch('http://localhost:5000/api/v1/admin/departments', {
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
        <h2 className="text-2xl font-bold text-foreground">Departments</h2>
        <button onClick={() => setIsAdding(!isAdding)} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4 mr-2" /> Add Department
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="mb-8 bg-background p-4 rounded-xl border border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input required placeholder="Name (e.g. Computer Science)" value={name} onChange={e => setName(e.target.value)} className="border p-2 rounded-lg" />
            <input required placeholder="Code (e.g. CS01)" value={code} onChange={e => setCode(e.target.value)} className="border p-2 rounded-lg" />
            <input placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} className="border p-2 rounded-lg" />
          </div>
          <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-lg">Save</button>
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
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Code</th>
                <th className="px-6 py-3">Description</th>
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
                  <td className="px-6 py-4">{row.name}</td>
                  <td className="px-6 py-4">{row.code}</td>
                  <td className="px-6 py-4">{row.description}</td>
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
