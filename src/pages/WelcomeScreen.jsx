import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const WelcomeScreen = () => {
  const navigate = useNavigate();

  const handleProviderRegister = () => {
    navigate('/register-provider');
  };

  return (
    <Container fluid className="d-flex align-items-center justify-content-center min-vh-100" style={{ background: 'var(--main-bg)' }}>
      <Row className="w-100 justify-content-center">
        <Col md={10} lg={8} xl={7}>
          <Card className="p-4 shadow-lg" style={{ borderRadius: '1rem' }}>
            <Card.Body className="text-center">
              <h2 className="mb-4 section-title">Bienvenido a Nuestra Plataforma</h2>
              <p className="lead mb-4">
                Selecciona cómo deseas registrarte para comenzar:
              </p>
              <Row className="g-3">
                <Col md={6}>
                  <Card className="card-cliente h-100">
                    <Card.Body className="d-flex flex-column justify-content-between">
                      <h5 className="card-title">Soy Cliente</h5>
                      <p className="card-text">
                        Busca y contrata servicios de profesionales y empresas.
                      </p>
                      <Button variant="primary" className="w-100 mt-3" onClick={() => navigate('/register-customer')}>
                        Registrarse como Cliente
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="card-proveedor h-100">
                    <Card.Body className="d-flex flex-column justify-content-between">
                      <h5 className="card-title">Soy Proveedor</h5>
                      <p className="card-text">
                        Ofrece tus servicios y encuentra nuevos clientes.
                      </p>
                      <Button variant="success" className="w-100 mt-3" onClick={handleProviderRegister}>
                        Registrarse como Proveedor
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <div className="mt-4">
                <p>¿Ya tienes una cuenta? <a href="#" className="text-decoration-none" style={{ color: 'var(--linkedin-blue)' }}>Inicia Sesión aquí</a></p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default WelcomeScreen;
