'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  MessageSquare, 
  BookOpen, 
  CalendarDays, 
  ClipboardList,
  Bell,
  LogOut,
  Menu,
  X,
  User as UserIcon
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ThemeSettingsModal } from '@/components/ThemeSettings';
import { Settings } from 'lucide-react';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isThemeSettingsOpen, setThemeSettingsOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setSidebarOpen(window.innerWidth >= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Fetch notifications
    fetch('http://localhost:5000/api/v1/student/announcements', { credentials: 'include' })
      .then(res => res.json())
      .then(d => {
        if (!d.error) setAnnouncements(d.slice(0, 3)); // keep top 3
      })
      .catch(err => console.error(err));

    // Close dropdowns on click outside
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const navItems = [
    { name: 'Dashboard', href: '/student', icon: LayoutDashboard },
    { name: 'AI Assistant', href: '/student/chat', icon: MessageSquare },
    { name: 'Study Materials', href: '/student/materials', icon: BookOpen },
    { name: 'Assignments', href: '/student/assignments', icon: ClipboardList },
    { name: 'Timetable', href: '/student/timetable', icon: CalendarDays },
    { name: 'Announcements', href: '/student/announcements', icon: Bell },
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
            className={`flex-shrink-0 bg-card border-r border-border z-30 flex flex-col h-full ${isMobile ? 'fixed left-0 top-0 shadow-2xl' : 'relative'}`}
            style={{ width: 280 }}
          >
            <div className="h-16 flex items-center justify-between px-6 border-b border-border">
              <span className="text-xl font-bold text-primary tracking-tight">Helpdesk AI</span>
              {isMobile && (
                <button onClick={() => setSidebarOpen(false)} className="p-1 text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
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
                      className={`flex items-center px-4 py-3 rounded-lg mb-1 transition-colors ${isActive ? 'bg-primary text-white shadow-md shadow-indigo-200' : 'text-muted-foreground hover:bg-muted'}`}
                    >
                      <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-muted-foreground'}`} />
                      <span className="font-medium">{item.name}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            <div className="p-4 border-t border-border">
              <button 
                onClick={logout}
                className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-muted-foreground rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5 mr-3 text-muted-foreground" />
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
              {navItems.find(i => i.href === pathname)?.name || 'Portal'}
            </h2>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <ThemeToggle />
            
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setNotificationsOpen(!isNotificationsOpen)}
                className={`p-2 transition-colors relative rounded-md ${isNotificationsOpen ? 'bg-muted text-primary' : 'text-muted-foreground hover:text-primary'}`}
              >
                <Bell className="w-5 h-5" />
                {announcements.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-80 bg-card rounded-xl shadow-lg border border-border z-50 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-border bg-background flex justify-between items-center">
                      <h3 className="font-semibold text-foreground">Notifications</h3>
                      <span className="text-xs font-medium bg-primary text-white px-2 py-0.5 rounded-full">{announcements.length} New</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {announcements.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground text-sm">No new notifications</div>
                      ) : (
                        announcements.map((a, i) => (
                          <div key={i} className="p-4 border-b border-slate-50 hover:bg-background transition-colors">
                            <p className="font-semibold text-foreground text-sm mb-1">{a.title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-2">{a.desc}</p>
                            <p className="text-[10px] text-muted-foreground mt-2">{a.date}</p>
                          </div>
                        ))
                      )}
                    </div>
                    <Link href="/student/announcements" onClick={() => setNotificationsOpen(false)} className="block w-full text-center p-3 text-sm text-primary font-medium hover:bg-background transition-colors">
                      View all announcements
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="flex items-center space-x-3 border-l border-border pl-4 relative" ref={profileRef}>
              <button 
                onClick={() => setProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 focus:outline-none hover:bg-background p-1.5 rounded-lg transition-colors"
              >
                {user?.profile_photo ? (
                  <img src={user.profile_photo} alt="Profile" className="w-8 h-8 rounded-full object-cover shadow-sm shadow-border border border-border" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-sm font-bold text-foreground leading-tight">{user?.full_name || 'Student'}</span>
                  <span className="text-xs font-medium text-muted-foreground leading-tight">{user?.username}</span>
                </div>
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-card rounded-xl shadow-lg border border-border z-50 overflow-hidden"
                  >
                    <div className="py-1">
                      <Link 
                        href="/student/profile" 
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-foreground hover:bg-background transition-colors"
                      >
                        <UserIcon className="w-4 h-4 mr-3 text-muted-foreground" />
                        My Profile
                      </Link>
                      <button 
                        onClick={() => { setProfileOpen(false); setThemeSettingsOpen(true); }}
                        className="w-full flex items-center px-4 py-2.5 text-sm text-foreground hover:bg-background transition-colors"
                      >
                        <Settings className="w-4 h-4 mr-3 text-muted-foreground" />
                        Appearance
                      </button>
                      <button 
                        onClick={logout}
                        className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-3 text-red-500" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
