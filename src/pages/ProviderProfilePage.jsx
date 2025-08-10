import React, { useEffect, useState, useCallback } from 'react';
import { Container, Row, Col, Card, Image } from 'react-bootstrap';
import { getProviderProfileData, getProfile } from '../services/profileService.js';
import ProfessionalInfoSection from '../components/profile/ProfessionalInfoSection.jsx';
import AddressSection from '../components/profile/AddressSection.jsx';
import ServiceAreaSection from '../components/profile/ServiceAreaSection.jsx';
import './ProviderProfilePage.css';

export const ProviderProfilePage = () => {
  const [provider, setProvider] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);

  const fetchProviderData = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const providerData = await getProviderProfileData(token);
      console.log("📦 providerData recibido:", providerData);

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
    <Container className="mt-5">
      <header className="profile-page-header text-center mb-4">
        <Image src={`https://ui-avatars.com/api/?name=${user.name}+${user.lastname}`} roundedCircle className="profile-avatar mb-3" />
        <h2>{user.name} {user.lastname}</h2>
        <p className="text-muted">{provider?.profession?.name}</p>
      </header>

      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Datos de Contacto</Card.Title>
              <p><strong>Email:</strong> {user.email}</p>
              {/* Aquí se puede agregar más información de contacto */}
            </Card.Body>
          </Card>
          <AddressSection provider={provider} onUpdate={fetchProviderData} />
          <ServiceAreaSection provider={provider} onUpdate={fetchProviderData} />
        </Col>
        <Col md={8}>
          <ProfessionalInfoSection provider={provider} onUpdate={fetchProviderData} />
        </Col>
      </Row>
    </Container>
  );
};

export default ProviderProfilePage;
