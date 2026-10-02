'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function TimetablePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/v1/student/timetable', { credentials: 'include' })
      .then(res => res.json())
      .then(d => {
        setData(d.error ? [] : d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Class Timetable</h2>
      
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
