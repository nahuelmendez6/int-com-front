import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import './ProviderProfilePage.css';
import { useAuth } from '../context/AuthContext.jsx';

export const ProviderProfilePage = () => {
  const {
    profile: user,
    providerProfile: provider,
    updateProfileImage,
    fetchProfileData,
    isLoading
  } = useAuth();

  const [error, setError] = useState(false);

  const handleServiceAreaUpdate = async () => {
    try {
      await fetchProfileData();
    } catch(err) {
      setError(true);
      console.error('Error actualizando area de servicio: ', err);
    }
  }

  if (isLoading || !provider || !user) return <p>Cargando...</p>;
  if (error) return <p>Ocurrió un error al cargar el perfil.</p>;

  return (
    <Container className="mt-5">
      <Outlet context={{ user, provider, fetchProfileData, updateProfileImage, handleServiceAreaUpdate }} />
    </Container>
  );
};

export default ProviderProfilePage;