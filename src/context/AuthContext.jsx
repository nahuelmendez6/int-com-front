import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as authLogin } from '../services/authService';


import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // New loading state

  useEffect(() => {
  const loadAuthData = () => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    const storedUserId = localStorage.getItem('userId');

    if (storedUser && storedToken && storedRole && storedUserId) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      setRole(storedRole);
      setUserId(storedUserId);

      // 👇 configurar axios con el token al recargar
      // axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
    setIsLoading(false);
  };

  loadAuthData();
}, []);

  const login = async (credentials) => {
    try {
      const data = await authLogin(credentials);
      const { access, refresh, role, user_id, email } = data;

      const userData = { email };

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', access); // Store access token
      localStorage.setItem('refreshToken', refresh); // Store refresh token
      localStorage.setItem('role', role);
      localStorage.setItem('userId', user_id);

      setUser(userData);
      setToken(access);
      setRole(role);
      setUserId(user_id);

      axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;

      return data; // Return data for redirection logic in components
    } catch (error) {
      console.error('Login error in AuthContext:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    setUser(null);
    setToken(null);
    setRole(null);
    setUserId(null);

    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, token, role, userId, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
