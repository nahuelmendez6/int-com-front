import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Container, Row, Col, Card, Image, Button } from 'react-bootstrap';
import { getProviderProfileData, getProfile, updateProfileImage } from '../services/profileService.js';
import ProfessionalInfoSection from '../components/profile/ProfessionalInfoSection.jsx';
import AddressSection from '../components/profile/AddressSection.jsx';
import ServiceAreaSection from '../components/profile/ServiceAreaSection.jsx';
import ProviderServiceArea from '../components/profile/ProviderServiceArea.jsx';
import './ProviderProfilePage.css';

export const ProviderProfilePage = () => {
  const [provider, setProvider] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);
  const [isEditingServiceArea, setIsEditingServiceArea] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);


  const fileInputRef = useRef(null)

  const fetchProviderData = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const providerData = await getProviderProfileData(token);
      setProvider(providerData);
    } catch (err) {
      setError(true);
      console.error('Error al obtener los datos del proveedor:', err);
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
        console.error('Error al obtener los datos iniciales:', err);
      }
    };

    fetchInitialData();
  }, [fetchProviderData]);

  const handleServiceAreaUpdate = () => {
    fetchProviderData();
    setIsEditingServiceArea(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file); // Guardamos el archivo
      setPreviewImage(URL.createObjectURL(file));
    }
  };


  const handleUploadImage = async () => {
    if (!selectedFile) return;

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('profile_image', selectedFile);

    try {
      await updateProfileImage(token, formData);
      const updatedUser = await getProfile(token);
      setUser(updatedUser);
      setSelectedFile(null); // Limpiamos la selección
    } catch (error) {
      console.error('Error al actualizar la foto:', error);
    }
  };


  const uploadProfileImage = async (file) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('profile_image', file);

    try {
      await updateProfileImage(token, formData);
      // Recargar datos de usuario para mostrar la nueva foto real
      const updatedUser = await getProfile(token);
      setUser(updatedUser);
    } catch (error) {
      console.error('Error al actualizar la foto:', error);
    }
  };

  if (error) return <p>Ocurrió un error al cargar el perfil.</p>;
  if (!provider || !user) return <p>Cargando...</p>;

  return (
    <Container className="mt-5">
      <header className="profile-page-header text-center mb-4">
        <div style={{ position: 'relative', display: 'inline-block' }}>
  <Image
    // src={
    //   previewImage
    //     ? previewImage
    //     : user.profile_image
    //     ? user.profile_image
    //     : `https://ui-avatars.com/api/?name=${user.name}+${user.lastname}`
    // }
    src={previewImage || user.profile_image || `https://ui-avatars.com/api/?name=${user.name}+${user.lastname}`}
    roundedCircle
    className="profile-avatar mb-3"
    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
  />

  {/* Botón para abrir selector de archivos */}
  <Button
    size="sm"
    variant="secondary"
    style={{
      position: 'absolute',
      bottom: '5px',
      right: '5px',
      borderRadius: '50%',
      padding: '5px'
    }}
    onClick={() => fileInputRef.current.click()} // abre el input oculto
  >
    ✏️
  </Button>

  <input
    type="file"
    accept="image/*"
    ref={fileInputRef}
    style={{ display: 'none' }}
    onChange={handleImageChange}
  />

  {/* Botón Guardar solo si hay archivo seleccionado */}
  {selectedFile && (
    <Button
      size="sm"
      variant="success"
      className="mt-2"
      onClick={handleUploadImage}
    >
      Guardar
    </Button>
  )}
</div>



        <h2>{user.name} {user.lastname}</h2>
        <p className="text-muted">{provider?.profession?.name}</p>
      </header>

      <Row className="mb-4">
        <Col md={8}>
          <ProfessionalInfoSection provider={provider} onUpdate={fetchProviderData} />
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Datos de Contacto</Card.Title>
              <p><strong>Email:</strong> {user.email}</p>
              {/* Aquí se puede agregar más información de contacto */}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={6} className="mb-4">
          <AddressSection provider={provider} onUpdate={fetchProviderData} />
        </Col>
        <Col md={6} className="mb-4">
          {isEditingServiceArea ? (
            <ServiceAreaSection
              provider={provider}
              onUpdate={handleServiceAreaUpdate}
              onCancel={() => setIsEditingServiceArea(false)}
            />
          ) : (
            <ProviderServiceArea
              providerId={provider?.id_provider}
              onEdit={() => setIsEditingServiceArea(true)}
              onUpdate={handleServiceAreaUpdate}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProviderProfilePage;
