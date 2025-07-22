import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import './WelcomeScreen.css';

import welcome from '../assets/welcome.svg'

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Use the login function from AuthContext
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null); // Clear previous errors
    try {
      const data = await login({ email, password });
      console.log('Login successful:', data);
      // Redirect based on role
      switch (data.role) {
        case 'customer':
          navigate('/dashboard-customer'); // Assuming a customer dashboard route
          break;
        case 'provider':
          navigate('/dashboard-provider'); // Assuming a provider dashboard route
          break;
        case 'admin':
          navigate('/dashboard-admin'); // Assuming an admin dashboard route
          break;
        default:
          navigate('/dashboard'); // Default dashboard
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.detail || 'Error al iniciar sesión. Por favor, verifica tus credenciales.');
    }
  };

  return (
    <div className="welcome-screen">
      <Container className="welcome-container">
        <header className="d-flex justify-content-between align-items-center py-3">
          {/* <h1 className="h2 text-primary">Integracion comunitaria</h1> */}
        </header>

        <main>
          <Row className="hero-section align-items-center">
            <Col md={6} className="hero-content">
              <h3 >Bienvenido a Integración Comunitaria</h3>
              <div className="login-form bg-white">
                <Form onSubmit={handleSubmit}>
                  {error && <Alert variant="danger">{error}</Alert>}
                  <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                    <Form.Label column sm="3">Email</Form.Label>
                    <Col sm="9">
                      <Form.Control
                        type="email"
                        placeholder="Ingresa tu email"
                        size="lg"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3" controlId="formBasicPassword">
                    <Form.Label column sm="3">Contraseña</Form.Label>
                    <Col sm="9">
                      <Form.Control
                        type="password"
                        placeholder="Contraseña"
                        size="lg"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
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
                src={welcome}
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