import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios'; // 🔹 Importar axios
import { login as authLogin } from '../services/authService'; // 🔹 Función de login
import { getProfile, getProviderProfileData, getCustomerProfileData,updateProfileImage as updateProfileImageService } from '../services/profileService'; // 🔹 Funciones de perfil


const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);           // datos básicos del usuario
  const [providerProfile, setProviderProfile] = useState(null); // datos extendidos si es provider
  const [customerProfile, setCustomerProfile] = useState(null); // datos extendidos de customer
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const initializeAuth = async () => {
        const storedToken = localStorage.getItem('token');
        const storedRole = localStorage.getItem('role');
        const storedUserId = localStorage.getItem('userId');
        console.log('AuthContext: Initializing...');
        console.log('AuthContext: Stored Token:', storedToken ? 'Present' : 'Missing');
        console.log('AuthContext: Stored Role:', storedRole);
        console.log('AuthContext: Stored UserId:', storedUserId);

        if (storedToken && storedRole && storedUserId) {
          setToken(storedToken);
          setRole(storedRole);
          setUserId(storedUserId);
          axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
          console.log('AuthContext: Token found, fetching profile data...');
          await fetchProfileData(storedToken, storedRole, signal);
        }
        console.log('AuthContext: Setting isLoading to false.');
        setIsLoading(false);
    }

    initializeAuth();

    return () => {
      controller.abort();
    };
  }, []);

  const fetchProfileData = async (token, role, signal) => {
    try {
      const profileData = await getProfile(token, signal);
      console.log('AuthContext: Fetched base profile data:', profileData);
      setProfile(profileData);

      if (role === 'provider') {
        const providerData = await getProviderProfileData(token, signal);
        console.log('AuthContext: Fetched provider profile data:', providerData);
        if (providerData.categories && providerData.categories.length > 0) {
            console.log('AuthContext: First provider category object:', providerData.categories[0]);
        }
        setProviderProfile(providerData);
      } else if (role === 'customer') {
        const customerData = await getCustomerProfileData(token, signal);
        console.log('AuthContext: Fetched customer profile data:', customerData);
        setCustomerProfile(customerData);
      }
    } catch (err) {
      if (err.name !== 'CanceledError') {
        console.error("Error fetching profile data:", err);
      }
    }
  };

  const login = async (credentials) => {
    try {
      const data = await authLogin(credentials);
      const { access, refresh, role, user_id, email } = data;

      localStorage.setItem('user', JSON.stringify({ email }));
      localStorage.setItem('token', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', user_id);

      setToken(access);
      setRole(role);
      setUserId(user_id);

      axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;

      await fetchProfileData(access, role);
      return data;
    } catch (error) {
      console.error('Login error in AuthContext:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.clear();
    setProfile(null);
    setProviderProfile(null);
    setToken(null);
    setRole(null);
    setUserId(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  const updateProfileImage = async (file) => {
    if (!token) return;

    const formData = new FormData();
    formData.append("profile_image", file);

    try {
      await updateProfileImageService(token, formData);
      const updatedProfile = await getProfile(token);
      setProfile(updatedProfile);
    } catch (err) {
      console.error("Error updating profile image:", err);
      throw err;
    }
  };


  return (
    <AuthContext.Provider value={{
      profile,
      providerProfile,
      id_provider: providerProfile?.id_provider,
      customerProfile,
      token,
      role,
      userId,
      login,
      logout,
      isLoading,
      updateProfileImage,
      fetchProfileData
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
