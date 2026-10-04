import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { initialUsers } from '../data/demoData';

const AuthContext = createContext(null);

// Get users from localStorage or fall back to demo data
const getUsers = () => {
  try {
    const stored = localStorage.getItem('pathway_users');
    return stored ? JSON.parse(stored) : initialUsers;
  } catch {
    return initialUsers;
  }
};

const saveUsers = (users) => {
  localStorage.setItem('pathway_users', JSON.stringify(users));
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load session from localStorage on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('pathway_token');
      const storedUser = localStorage.getItem('pathway_user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch {
      localStorage.removeItem('pathway_token');
      localStorage.removeItem('pathway_user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getUsers();
        const found = users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        if (!found) {
          reject(new Error('Incorrect email or password.'));
          return;
        }
        
        const { password: _, ...safeUser } = found;
        const fakeToken = btoa(JSON.stringify({ id: found.id, role: found.role, ts: Date.now() }));
        
        localStorage.setItem('pathway_token', fakeToken);
        localStorage.setItem('pathway_user', JSON.stringify(safeUser));
        setToken(fakeToken);
        setUser(safeUser);
        resolve(safeUser);
      }, 500);
    });
  }, []);

  const register = useCallback(async (name, email, password, role, city) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getUsers();
        if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
          reject(new Error('An account with this email already exists.'));
          return;
        }

        const newUser = {
          id: `usr-${Math.random().toString(36).substring(2)}`,
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password,
          role: role || 'patient',
          city: city || 'Harare',
          createdAt: new Date().toISOString(),
        };

        users.push(newUser);
        saveUsers(users);

        const { password: _, ...safeUser } = newUser;
        resolve({ user: safeUser, message: 'Account created successfully.' });
      }, 500);
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('pathway_token');
    localStorage.removeItem('pathway_user');
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('pathway_user', JSON.stringify(updated));
      // Also update in the users store so login works with new data
      try {
        const users = getUsers();
        const idx = users.findIndex((u) => u.id === updated.id);
        if (idx !== -1) {
          users[idx] = { ...users[idx], ...updates };
          saveUsers(users);
        }
      } catch { /* ignore */ }
      return updated;
    });
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
