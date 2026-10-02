'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Book, GraduationCap, Calendar, Save, Loader2, CheckCircle2 } from 'lucide-react';

import { useAuth } from '@/context/AuthContext';

export default function StudentProfile() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Editable fields
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const { setUser, user } = useAuth(); // to trigger a nav update

  useEffect(() => {
    fetch('http://localhost:5000/api/v1/student/profile', { credentials: 'include' })
      .then(res => res.json())
      .then(d => {
        setData(d);
        setFullName(d.full_name);
        setAddress(d.address || '');
        setProfilePhoto(d.profile_photo || '');
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('http://localhost:5000/api/v1/student/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ full_name: fullName, address, profile_photo: profilePhoto })
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        // Refresh auth context so nav bar updates instantly
        fetch('http://localhost:5000/auth/api/me', { credentials: 'include' })
          .then(r => r.json())
          .then(userData => {
            if (user) {
              setUser({ ...user, full_name: fullName, profile_photo: profilePhoto });
            }
          });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!data) return <div>Error loading profile.</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-card rounded-2xl shadow-sm shadow-border border border-border overflow-hidden relative">
        <div className="h-32 bg-gradient-to-r from-primary to-accent relative">
          <div className="absolute -bottom-12 left-8 p-1 bg-card rounded-full z-10">
            {profilePhoto || data.profile_photo ? (
              <img src={profilePhoto || data.profile_photo} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-white shadow-sm shadow-border object-cover" />
            ) : (
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center border-4 border-white shadow-sm shadow-border">
                <span className="text-3xl font-bold text-primary">{fullName.charAt(0)}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="pt-16 pb-8 px-8">
          <h2 className="text-2xl font-bold text-foreground">{fullName}</h2>
          <p className="text-muted-foreground font-medium">{data.roll_number}</p>
        </div>
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-card rounded-2xl shadow-sm shadow-border border border-border p-8 space-y-8"
      >
        <div>
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-primary" /> Profile Settings
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Full Name</label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Roll Number (Immutable)</label>
              <input 
                type="text" 
                value={data.roll_number}
                disabled
                className="w-full border border-border bg-background rounded-lg px-4 py-2 text-muted-foreground cursor-not-allowed"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Profile Photo URL</label>
              <input 
                type="text" 
                value={profilePhoto}
                onChange={(e) => setProfilePhoto(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="w-full border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Address / City</label>
              <textarea 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Where do you live?"
                rows={1}
                className="w-full border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors resize-none"
              />
            </div>
          </div>
          
          <div className="mt-8 flex items-center">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center"
            >
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Changes
            </button>
            {success && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="ml-4 text-emerald-600 text-sm font-medium flex items-center"
              >
                <CheckCircle2 className="w-4 h-4 mr-1" /> Updated
              </motion.span>
            )}
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center">
            <Book className="w-5 h-5 mr-2 text-primary" /> Academic Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-background p-4 rounded-xl border border-border flex items-start">
              <GraduationCap className="w-10 h-10 text-indigo-400 mr-4 opacity-50" />
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Course & Dept</p>
                <p className="font-medium text-foreground">{data.course}</p>
                <p className="text-sm text-muted-foreground">{data.department}</p>
              </div>
            </div>
            
            <div className="bg-background p-4 rounded-xl border border-border flex items-start">
              <Calendar className="w-10 h-10 text-indigo-400 mr-4 opacity-50" />
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Timeline</p>
                <p className="font-medium text-foreground">Semester {data.semester}</p>
                <p className="text-sm text-muted-foreground">Admitted: {data.admission_year}</p>
              </div>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
