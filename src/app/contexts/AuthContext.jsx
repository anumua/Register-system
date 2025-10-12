'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({ loading: true, authenticated: false, user: null });
  const router = useRouter();
  const pathname = usePathname(); // ใช้ตรวจ path ปัจจุบัน

  const checkAuthStatus = async () => {
    // ✅ ถ้าอยู่หน้า /detail → skip การเรียก API
    if (pathname.startsWith('/detail')) {
      setAuthState({ loading: false, authenticated: false, user: null });
      return;
    }

    try {
      const res = await fetch('/api/auth/me', { credentials: 'include', cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setAuthState({ loading: false, authenticated: !!data.authenticated, user: data.user || null });
      } else {
        setAuthState({ loading: false, authenticated: false, user: null });
      }
    } catch (error) {
      setAuthState({ loading: false, authenticated: false, user: null });
    }
  };

  const login = async (userData) => {
    setAuthState({ loading: false, authenticated: true, user: userData });
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      // Even if logout fails, clear the local state
    }
    setAuthState({ loading: false, authenticated: false, user: null });
    router.replace('/login');
  };

  // ตรวจสอบ auth status ตอน mount และเปลี่ยน path
  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (!isMounted) return;
      await checkAuthStatus();
    })();
    return () => { isMounted = false; };
  }, [pathname]);

  // ตรวจสอบ auth status เมื่อ window focus หรือทุก 30 วินาที
  useEffect(() => {
    const handleFocus = () => { checkAuthStatus(); };
    window.addEventListener('focus', handleFocus);
    const interval = setInterval(() => { checkAuthStatus(); }, 30000);
    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, [pathname]);

  return (
    <AuthContext.Provider value={{ authState, login, logout, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
