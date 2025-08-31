import React, { useState, useRef } from 'react';
import { Container, Card, Image, Button, ListGroup, Row, Col } from 'react-bootstrap';
import AddressSection from '../components/profile/AddressSection.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export const CustomerProfile = () => {
    const [error, setError] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const {
        profile: user,
        updateProfileImage,
        customerProfile,
        fetchProfileData,
        isLoading,
        token,
        role
      } = useAuth();
    
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleUploadImage = async () => {
        if (!selectedFile) return;
        
        try {
            await updateProfileImage(selectedFile);
            setSelectedFile(null);
            setPreviewImage(null);
        } catch (err) {
            setError(true);
            console.error('Error uploading image:', err);
        }
    };

    const handleProfileUpdate = async () => {
        try {
            await fetchProfileData(token, role);
        } catch (err) {
            console.error("Error refetching profile data:", err);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading profile data.</div>;
    if (!user) return <div>Could not load user profile.</div>;

    return (
    <Container className="mt-5">
      <header className="profile-page-header text-center mb-4">
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <Image
            src={previewImage || user.profile_image || `https://ui-avatars.com/api/?name=${user.name}+${user.lastname}`}
            roundedCircle
            className="profile-avatar mb-3"
            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
          />
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
            onClick={() => fileInputRef.current.click()}
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
        <p className="text-muted">{user?.profession?.name || 'Cliente'}</p>
      </header>

      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Datos de Contacto</Card.Title>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Row>
                <Col sm={3}><strong>Email:</strong></Col>
                <Col sm={9}>{user.email}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col sm={3}><strong>Teléfono:</strong></Col>
                <Col sm={9}>{user.phone || 'No disponible'}</Col>
              </Row>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Dirección</Card.Title>
          <AddressSection customer={customerProfile} onUpdate={handleProfileUpdate} />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CustomerProfile;