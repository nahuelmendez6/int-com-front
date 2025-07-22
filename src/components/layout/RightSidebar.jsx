import React from 'react';
import { Card } from 'react-bootstrap';

const RightSidebar = () => {
  return (
    <div className="right-sidebar-linkedin fixed-top-offset">
      <Card className="mb-3">
        <Card.Body>
          <Card.Title>Sugerencias</Card.Title>
          <Card.Text>
            Aquí irán las sugerencias de personas, empresas, etc.
          </Card.Text>
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <Card.Title>Añadir a tu feed</Card.Title>
          <Card.Text>
            Noticias destacadas o juegos.
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};

export default RightSidebar;
