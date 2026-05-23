import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('mtf_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const signUp = ({ name, email, password }) => {
    // Get existing users
    const users = JSON.parse(localStorage.getItem('mtf_users') || '[]');
    if (users.find(u => u.email === email)) {
      throw new Error('An account with this email already exists.');
    }
    const newUser = { id: Date.now(), name, email, password, createdAt: new Date().toISOString() };
    users.push(newUser);
    localStorage.setItem('mtf_users', JSON.stringify(users));
    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    localStorage.setItem('mtf_user', JSON.stringify(safeUser));
    return safeUser;
  };

  const login = ({ email, password }) => {
    const users = JSON.parse(localStorage.getItem('mtf_users') || '[]');
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) throw new Error('Invalid email or password.');
    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    localStorage.setItem('mtf_user', JSON.stringify(safeUser));
    return safeUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mtf_user');
  };

  return (
    <AuthContext.Provider value={{ user, signUp, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
