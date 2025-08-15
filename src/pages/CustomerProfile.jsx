import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Container, Row, Col, Card, Image, Button } from 'react-bootstrap';
import { getProfile, updateProfileImage } from '../services/profileService.js';

export const CustomerProfile = () => {
    const [customer, setCustomer] = useState(null);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const fileInputRef = useRef(null);

    const fetchCustomerData = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const customerData = await getProfile(token);
            setCustomer(customerData);
            setUser(customerData);
        } catch (err) {
            setError(true);
            console.error('Error fetching customer data:', err);
        }
    }, []);

    useEffect(() => {
        fetchCustomerData();
    }, [fetchCustomerData]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
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
            await fetchCustomerData(); // Refetch customer data after upload
            setSelectedFile(null);
            setPreviewImage(null);
        } catch (err) {
            setError(true);
            console.error('Error uploading image:', err);
        }
    };

    if (error) return <div>Error loading profile data.</div>;
    if (!customer || !user) return <div>Loading...</div>;

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
        <p className="text-muted">{customer?.profession?.name || 'Cliente'}</p>
      </header>

      <Row className="mb-4">
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title>Información Personal</Card.Title>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Teléfono:</strong> {customer?.phone || 'No disponible'}</p>
              {/* Puedes agregar más campos específicos del cliente */}
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Dirección</Card.Title>
              <p>{customer?.address || 'No disponible'}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CustomerProfile;
