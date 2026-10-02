'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, MessageSquare, HelpCircle, GraduationCap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/v1/admin/dashboard', { credentials: 'include' })
      .then(res => res.json())
      .then(d => {
        setData(d.error ? null : d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
      {[1,2,3,4].map(i => <div key={i} className="h-32 bg-muted rounded-2xl"></div>)}
      <div className="col-span-1 md:col-span-3 h-80 bg-muted rounded-2xl"></div>
      <div className="h-80 bg-muted rounded-2xl"></div>
    </div>
  );

  if (!data) return <p className="text-red-500">Failed to load dashboard data. Please log in again or check server.</p>;

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-6 shadow-sm shadow-border border border-border flex items-center justify-between relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full opacity-50 blur-xl"></div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Students</p>
            <h3 className="text-3xl font-bold text-foreground">{data.total_students}</h3>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
            <Users size={24} />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl p-6 shadow-sm shadow-border border border-border flex items-center justify-between relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/5 rounded-full opacity-50 blur-xl"></div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Study Materials</p>
            <h3 className="text-3xl font-bold text-foreground">{data.total_materials}</h3>
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <BookOpen size={24} />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl p-6 shadow-sm shadow-border border border-border flex items-center justify-between relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-50 rounded-full opacity-50 blur-xl"></div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Chat Sessions</p>
            <h3 className="text-3xl font-bold text-foreground">{data.total_chats}</h3>
          </div>
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
            <MessageSquare size={24} />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card rounded-2xl p-6 shadow-sm shadow-border border border-border flex items-center justify-between relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-50 rounded-full opacity-50 blur-xl"></div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Active FAQs</p>
            <h3 className="text-3xl font-bold text-foreground">{data.total_faqs}</h3>
          </div>
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
            <HelpCircle size={24} />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="bg-card rounded-2xl p-6 shadow-sm shadow-border border border-border lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-foreground flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-primary" />
              AI Assistant Usage (7 Days)
            </h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.ai_trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="queries" name="AI Queries" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorUsage)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Secondary Chart */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="bg-card rounded-2xl p-6 shadow-sm shadow-border border border-border">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-foreground flex items-center">
              <GraduationCap className="w-5 h-5 mr-2 text-emerald-500" />
              Students by Department
            </h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.department_stats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="students"
                >
                  {data.department_stats.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            {data.department_stats.map((dept: any, idx: number) => (
                <div key={idx} className="flex items-center text-xs font-medium text-muted-foreground">
                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                    {dept.name} ({dept.students})
                </div>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Third Row */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-card rounded-2xl p-6 shadow-sm shadow-border border border-border">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-foreground flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-amber-500" />
              Document Uploads (7 Days)
            </h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.weekly_uploads} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="uploads" name="Files Uploaded" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
      </motion.div>
    </div>
  );
}
