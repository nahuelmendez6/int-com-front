import React, { useEffect, useState, useCallback } from 'react';
import { getProviderProfileData, getProfile } from '../services/profileService.js';
import ProfessionalInfoSection from '../components/profile/ProfessionalInfoSection.jsx';

export const ProviderProfilePage = () => {
  const [provider, setProvider] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);

  const fetchProviderData = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const providerData = await getProviderProfileData(token);
      setProvider(providerData);
    } catch (err) {
      setError(true);
      console.error('❌ Error al obtener los datos del proveedor:', err);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchInitialData = async () => {
      try {
        const userData = await getProfile(token);
        setUser(userData);
        fetchProviderData();
      } catch (err) {
        setError(true);
        console.error('❌ Error al obtener los datos iniciales:', err);
      }
    };

    fetchInitialData();
  }, [fetchProviderData]);

  if (error) return <p>Ocurrió un error al cargar el perfil.</p>;
  if (!provider || !user) return <p>Cargando...</p>;

  return (
    <div className="container mt-5">
      <h2>Perfil del Proveedor</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Datos Personales</h5>
          <p><strong>Nombre:</strong> {user.name} {user.lastname}</p>
          <p><strong>Email:</strong> {user.email}</p>

          <h5 className="card-title mt-4">Datos de Proveedor</h5>
          <ProfessionalInfoSection provider={provider} onUpdate={fetchProviderData} />
        </div>
      </div>
    </div>
  );
};

export default ProviderProfilePage;
