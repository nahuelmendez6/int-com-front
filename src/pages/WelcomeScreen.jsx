import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './WelcomeScreen.css';

const WelcomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-screen">
      <Container className="welcome-container">
        <header className="d-flex justify-content-between align-items-center py-3">
          <h1 className="h2 text-primary">Integracion comunitaria</h1>
        </header>

        <main>
          <Row className="hero-section align-items-center">
            <Col md={6} className="hero-content">
              <h1 className="display-4 fw-light mb-4">Bienvenido a tu comunidad profesional</h1>
              <div className="login-form p-4 border rounded bg-white shadow-sm">
                <Form>
                  <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                    <Form.Label column sm="3">Email</Form.Label>
                    <Col sm="9">
                      <Form.Control type="email" placeholder="Ingresa tu email" size="lg" />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3" controlId="formBasicPassword">
                    <Form.Label column sm="3">Contraseña</Form.Label>
                    <Col sm="9">
                      <Form.Control type="password" placeholder="Contraseña" size="lg" />
                    </Col>
                  </Form.Group>
                  <div className="d-grid">
                    <Button variant="primary" type="submit" size="lg">
                      Iniciar Sesión
                    </Button>
                  </div>
                </Form>
                <hr className="my-4" />
                <div className="text-center">
                  <p className="mb-2">¿No tienes una cuenta?</p>
                  <div className="d-grid gap-2">
                    <Button variant="outline-success" onClick={() => navigate('/register-provider')}>
                      Registrarse como Proveedor
                    </Button>
                    <Button variant="outline-primary" onClick={() => navigate('/register-customer')}>
                      Registrarse como Cliente
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
            <Col md={6} className="hero-image">
              <img
                src="https://static.licdn.com/aero-v1/sc/h/dxf91zhqd2z6b0bwg85ktm5s4"
                alt="Welcome to your professional community"
                className="img-fluid"
              />
            </Col>
          </Row>
        </main>
      </Container>
    </div>
  );
};

export default WelcomeScreen;