import React, { createContext, useState } from 'react';
import jwtDecode from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const user = localStorage.getItem('authUser');
    return user ? JSON.parse(user) : null;
  });

  const login = (data) => {
    localStorage.setItem('authUser', JSON.stringify(data));
    setAuth(data);
  };

  const logout = () => {
    localStorage.removeItem('authUser');
    setAuth(null);
  };

  const getRole = () => {
    return auth?.user?.role || null;
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, getRole }}>
      {children}
    </AuthContext.Provider>
  );
};
