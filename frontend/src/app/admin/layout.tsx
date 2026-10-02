'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  BookOpen,
  FileText,
  Calendar,
  MessageSquare,
  HelpCircle,
  LogOut,
  Menu,
  ShieldCheck,
  Bell,
  Briefcase
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ThemeSettingsModal } from '@/components/ThemeSettings';
import { Settings } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isThemeSettingsOpen, setThemeSettingsOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setSidebarOpen(window.innerWidth >= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navItems = [
    { name: 'Analytics', href: '/admin', icon: LayoutDashboard },
    { name: 'Students', href: '/admin/students', icon: Users },
    { name: 'Faculty', href: '/admin/faculty', icon: Briefcase },
    { name: 'Departments', href: '/admin/departments', icon: Building2 },
    { name: 'Subjects', href: '/admin/subjects', icon: BookOpen },
    { name: 'Study Materials', href: '/admin/materials', icon: FileText },
    { name: 'Assignments', href: '/admin/assignments', icon: FileText },
    { name: 'Timetable', href: '/admin/timetable', icon: Calendar },
    { name: 'Chat Monitoring', href: '/admin/chats', icon: MessageSquare },
    { name: 'FAQs', href: '/admin/faqs', icon: HelpCircle },
    { name: 'Announcements', href: '/admin/announcements', icon: Bell },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden text-foreground">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-20 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {(isSidebarOpen || !isMobile) && (
          <motion.aside 
            initial={isMobile ? { x: -280 } : { width: 0, opacity: 0 }}
            animate={isMobile ? { x: 0 } : { width: 280, opacity: 1 }}
            exit={isMobile ? { x: -280 } : { width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={`flex-shrink-0 bg-slate-900 border-r border-slate-800 z-30 flex flex-col text-slate-300 h-full ${isMobile ? 'fixed left-0 top-0 shadow-2xl' : 'relative'}`}
            style={{ width: 280 }}
          >
            <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
              <div className="flex items-center">
                <ShieldCheck className="w-6 h-6 text-accent mr-3" />
                <span className="text-xl font-bold text-white tracking-tight">Admin Portal</span>
              </div>
              {isMobile && (
                <button onClick={() => setSidebarOpen(false)} className="p-1 text-slate-400 hover:text-white">
                  <Menu className="w-5 h-5" />
                </button>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link href={item.href} key={item.name} onClick={() => isMobile && setSidebarOpen(false)}>
                    <motion.div
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center px-4 py-3 rounded-lg mb-1 transition-colors ${isActive ? 'bg-primary text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'}`}
                    >
                      <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-muted-foreground'}`} />
                      <span className="font-medium text-sm">{item.name}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            <div className="p-4 border-t border-slate-800">
              <button 
                onClick={logout}
                className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-muted-foreground rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-colors"
              >
                <LogOut className="w-5 h-5 mr-3 opacity-70" />
                Sign Out
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 sm:px-6 z-10 shadow-sm shadow-border">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 mr-3 text-muted-foreground hover:bg-muted rounded-md"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-foreground hidden sm:block">
              {navItems.find(i => i.href === pathname)?.name || 'Admin Dashboard'}
            </h2>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <ThemeToggle />
            <button 
              onClick={() => setThemeSettingsOpen(true)}
              className="p-2 rounded-md text-muted-foreground hover:bg-muted transition-colors"
              aria-label="Appearance Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3 pl-4 border-l border-border">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
                AD
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:block">Administrator</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
      <ThemeSettingsModal isOpen={isThemeSettingsOpen} onClose={() => setThemeSettingsOpen(false)} />
    </div>
  );
}
