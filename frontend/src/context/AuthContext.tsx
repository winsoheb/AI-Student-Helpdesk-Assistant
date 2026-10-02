'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  username: string;
  role: 'admin' | 'student';
  full_name?: string;
  profile_photo?: string;
} | null;

interface AuthContextType {
  user: User;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const res = await fetch('http://localhost:5000/auth/api/me', {
          credentials: 'include'
        });
        const data = await res.json();
        
        if (data.authenticated) {
          setUser({ 
            username: data.username, 
            role: data.role, 
            full_name: data.full_name,
            profile_photo: data.profile_photo 
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await fetch('http://localhost:5000/auth/api/logout', { 
        method: 'POST',
        credentials: 'include' 
      });
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
