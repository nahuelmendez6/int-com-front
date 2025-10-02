import React, { useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Container, Row, Col, Card, Image, Button, ListGroup } from 'react-bootstrap';
import ProfessionalInfoSection from '../../components/profile/ProfessionalInfoSection';

const ProfileSectionPage = () => {
  const { user, provider, fetchProfileData, updateProfileImage } = useOutletContext();
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
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
      console.log('Error al actualizar la foto: ', err);
    }
  };

  return (
    <Container>
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
                <Button size="sm" variant="success" className="mt-2" onClick={handleUploadImage}>
                Guardar
                </Button>
            )}
            </div>
            <h2>{user.name} {user.lastname}</h2>
            <p className="text-muted">{provider?.profession?.name}</p>
      </header>

        <Card className="mb-4">
            <Card.Body>
                <ProfessionalInfoSection provider={provider} onUpdate={fetchProfileData} />
            </Card.Body>
        </Card>

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
                    <Col sm={9}>{user.phone}</Col>
                </Row>
                </ListGroup.Item>
            </ListGroup>
            </Card.Body>
        </Card>
    </Container>
  );
};

export default ProfileSectionPage;
