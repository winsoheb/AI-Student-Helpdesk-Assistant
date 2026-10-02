'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, Clock, FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function StudentDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/student/api/dashboard', { credentials: 'include' })
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-32 bg-muted animate-pulse rounded-2xl w-full"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-muted animate-pulse rounded-2xl"></div>
          <div className="h-32 bg-muted animate-pulse rounded-2xl"></div>
          <div className="h-32 bg-muted animate-pulse rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (!data) return <div>Failed to load dashboard data.</div>;

  const stats = [
    { label: 'Active Assignments', value: data.stats.active_assignments, icon: FileText, color: 'text-orange-500', bg: 'bg-orange-100' },
    { label: 'Upcoming Exams', value: data.stats.upcoming_exams, icon: Clock, color: 'text-red-500', bg: 'bg-red-100' },
    { label: 'Study Materials', value: data.stats.new_materials, icon: BookOpen, color: 'text-primary', bg: 'bg-primary/10' }
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Banner */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-r from-primary to-accent rounded-3xl p-8 sm:p-10 text-white shadow-lg relative overflow-hidden"
      >
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {data.student.name}! 👋</h1>
          <p className="text-indigo-100 max-w-xl text-lg">
            You are enrolled in Course #{data.student.course} • Semester {data.student.semester}. You have {data.stats.active_assignments} pending assignments due soon.
          </p>
          <div className="mt-8 flex gap-4">
            <Link href="/student/chat" className="bg-card text-primary px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-xl transition-all flex items-center hover:scale-105 active:scale-95">
              Ask AI Assistant <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
        {/* Abstract circles */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-card opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-40 -mb-20 w-60 h-60 bg-blue-300 opacity-20 rounded-full blur-2xl"></div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 + 0.2 }}
            className="bg-card rounded-2xl p-6 shadow-sm shadow-border border border-border flex items-center"
          >
            <div className={`${stat.bg} ${stat.color} w-14 h-14 rounded-xl flex items-center justify-center mr-5`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">{stat.label}</p>
              <h3 className="text-3xl font-bold text-foreground">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Assignments */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-2xl p-6 shadow-sm shadow-border border border-border"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-foreground">Upcoming Assignments</h3>
            <Link href="/student/assignments" className="text-sm text-primary font-medium hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {data.assignments.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4">No upcoming assignments.</p>
            ) : (
              data.assignments.map((a: any) => (
                <div key={a.id} className="flex justify-between items-center p-4 rounded-xl border border-slate-50 hover:bg-background transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-4">
                      <FileText className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{a.title}</h4>
                      <p className="text-xs text-muted-foreground">Due: {a.due_date}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-orange-50 text-orange-600 text-xs font-bold rounded-full">Pending</span>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Latest Announcements */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-2xl p-6 shadow-sm shadow-border border border-border"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-foreground">Latest Announcements</h3>
            <Link href="/student/announcements" className="text-sm text-primary font-medium hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {data.announcements.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4">No recent announcements.</p>
            ) : (
              data.announcements.map((a: any) => (
                <div key={a.id} className="p-4 rounded-xl border border-slate-50 bg-background hover:bg-muted transition-colors">
                  <h4 className="font-semibold text-foreground mb-1">{a.title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">{a.desc}</p>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
