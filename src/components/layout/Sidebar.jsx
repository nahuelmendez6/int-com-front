import React from 'react';
import { Card, Image, ListGroup } from 'react-bootstrap';

const Sidebar = () => {
  return (
    <div
      style={{
        width: '250px',
        height: '100vh',
        position: 'fixed',
        top: '56px', // altura del navbar
        left: 0,
        backgroundColor: '#f3f2ef',
        overflowY: 'auto',
        borderRight: '1px solid #ddd',
        padding: '1rem',
      }}
    >
      <Card className="mb-4">
        <Card.Body className="text-center">
          <Image
            src="https://via.placeholder.com/80"
            roundedCircle
            className="mb-2"
          />
          <Card.Title className="mb-0">Nombre Apellido</Card.Title>
          <Card.Text className="text-muted">Desarrollador Web</Card.Text>
        </Card.Body>
      </Card>

      <ListGroup variant="flush">
        <ListGroup.Item action href="#">Mi perfil</ListGroup.Item>
        <ListGroup.Item action href="#">Conexiones</ListGroup.Item>
        <ListGroup.Item action href="#">Grupos</ListGroup.Item>
        <ListGroup.Item action href="#">Eventos</ListGroup.Item>
        <ListGroup.Item action href="#">Hashtags seguidos</ListGroup.Item>
      </ListGroup>
    </div>
  );
};

export default Sidebar;
