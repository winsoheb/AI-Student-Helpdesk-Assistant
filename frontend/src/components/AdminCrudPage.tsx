'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminCrudPage({ title, description, endpoint, formSchema }: any) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [fileData, setFileData] = useState<File | null>(null);
  const [dropdownOptions, setDropdownOptions] = useState<any>({});

  const fetchData = async () => {
    try {
      const res = await fetch(`http://localhost:5000/${endpoint}`, { credentials: 'include' });
      const d = await res.json();
      setData(d.error ? [] : d);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdowns = async () => {
    const newOptions: any = {};
    for (const field of formSchema) {
      if (field.type === 'select' && field.endpoint) {
        try {
          const res = await fetch(`http://localhost:5000/${field.endpoint}`, { credentials: 'include' });
          newOptions[field.name] = await res.json();
        } catch (e) {}
      }
    }
    setDropdownOptions(newOptions);
  };

  useEffect(() => {
    fetchData();
    fetchDropdowns();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hasFile = formSchema.some((f: any) => f.type === 'file');
    
    let options: RequestInit = {
      method: 'POST',
      credentials: 'include'
    };

    if (hasFile) {
      const fd = new FormData();
      Object.keys(formData).forEach(k => fd.append(k, formData[k]));
      if (fileData) fd.append('file', fileData);
      options.body = fd;
    } else {
      options.headers = { 'Content-Type': 'application/json' };
      // Convert numeric fields if needed based on schema, but let's assume API handles or we just send as string/int
      options.body = JSON.stringify(formData);
    }

    await fetch(`http://localhost:5000/${endpoint}`, options);
    setIsModalOpen(false);
    setFormData({});
    setFileData(null);
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    await fetch(`http://localhost:5000/${endpoint}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
      credentials: 'include'
    });
    fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 flex items-center transition-opacity whitespace-nowrap w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Record
        </button>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted border-b border-border">
              <tr>
                {data[0] && Object.keys(data[0]).map(k => (
                  <th key={k} className="px-6 py-4">{k.replace('_', ' ')}</th>
                ))}
                {data.length > 0 && <th className="px-6 py-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} className="px-6 py-8 text-center text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading data...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-8 text-center text-muted-foreground">
                    <Database className="w-8 h-8 mx-auto mb-3 opacity-20" />
                    No records found.
                  </td>
                </tr>
              ) : (
                data.map((row, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    {Object.values(row).map((val: any, j) => (
                      <td key={j} className="px-6 py-4 text-foreground">{String(val)}</td>
                    ))}
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDelete(row.id)} className="text-red-500 hover:text-red-600 p-1">
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card rounded-xl max-w-md w-full shadow-xl overflow-hidden border border-border my-8"
            >
              <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/50">
                <h3 className="font-semibold text-foreground">Add New {title}</h3>
                <button type="button" onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">✕</button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {formSchema.map((field: any, idx: number) => (
                  <div key={idx}>
                    <label className="block text-sm font-medium text-foreground mb-1">{field.label}</label>
                    {field.type === 'textarea' ? (
                      <textarea 
                        required={field.required !== false}
                        onChange={e => setFormData({...formData, [field.name]: e.target.value})}
                        className="w-full p-2 border border-border rounded-lg bg-background text-foreground h-24 outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : field.type === 'select' ? (
                      <select 
                        required={field.required !== false}
                        onChange={e => setFormData({...formData, [field.name]: e.target.value})}
                        className="w-full p-2 border border-border rounded-lg bg-background text-foreground outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select...</option>
                        {field.options ? field.options.map((o: any) => (
                           <option key={o.value} value={o.value}>{o.label}</option>
                        )) : dropdownOptions[field.name]?.map((o: any) => (
                           <option key={o.id} value={o.id}>{o.name || o.code || o.title}</option>
                        ))}
                      </select>
                    ) : field.type === 'file' ? (
                      <input 
                        required={field.required !== false}
                        type="file" 
                        onChange={e => setFileData(e.target.files ? e.target.files[0] : null)}
                        className="w-full p-2 border border-border rounded-lg bg-background text-foreground file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                      />
                    ) : (
                      <input 
                        required={field.required !== false}
                        type={field.type || 'text'} 
                        onChange={e => setFormData({...formData, [field.name]: e.target.value})}
                        className="w-full p-2 border border-border rounded-lg bg-background text-foreground outline-none focus:ring-2 focus:ring-primary"
                      />
                    )}
                  </div>
                ))}
                
                <div className="pt-4 flex space-x-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 border border-border text-foreground rounded-lg hover:bg-muted font-medium transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 font-medium transition-opacity">Save</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
