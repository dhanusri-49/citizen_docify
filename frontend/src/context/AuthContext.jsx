import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        // Validate token by making a request to a protected endpoint
        API.get('/auth/me')
          .then(res => {
            setUser({ token, ...res.data });
          })
          .catch(() => {
            // Token is invalid, remove it
            localStorage.removeItem('token');
          })
          .finally(() => {
            setLoading(false);
          });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setUser({ token: res.data.token });
      return res.data;
    } catch (error) {
      // Re-throw the error so it can be handled by the calling component
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await API.post('/auth/register', { name, email, password });
      localStorage.setItem('token', res.data.token);
      setUser({ token: res.data.token });
      return res.data;
    } catch (error) {
      // Re-throw the error so it can be handled by the calling component
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};