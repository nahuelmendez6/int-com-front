import React, { useState } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import './WelcomeScreen.css';
import './ModernForm.css'; // Import the new CSS

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
              <h3 className="welcome-title">Bienvenido a Integración Comunitaria</h3>
              <form class="modern-form" onSubmit={handleSubmit}>
                <div class="form-title">Iniciar Sesión</div>
                {error && <Alert variant="danger">{error}</Alert>}
                <div class="form-body">
                  <div class="input-group">
                    <div class="input-wrapper">
                      <svg fill="none" viewBox="0 0 24 24" class="input-icon">
                        <path
                          stroke-width="1.5"
                          stroke="currentColor"
                          d="M3 8L10.8906 13.2604C11.5624 13.7083 12.4376 13.7083 13.1094 13.2604L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z"
                        ></path>
                      </svg>
                      <input
                        required=""
                        placeholder="Email"
                        class="form-input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div class="input-group">
                    <div class="input-wrapper">
                      <svg fill="none" viewBox="0 0 24 24" class="input-icon">
                        <path
                          stroke-width="1.5"
                          stroke="currentColor"
                          d="M12 10V14M8 6H16C17.1046 6 18 6.89543 18 8V16C18 17.1046 17.1046 18 16 18H8C6.89543 18 6 17.1046 6 16V8C6 6.89543 6.89543 6 8 6Z"
                        ></path>
                      </svg>
                      <input
                        required=""
                        placeholder="Contraseña"
                        class="form-input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      {/* Password toggle button can be added here if needed */}
                    </div>
                  </div>
                </div>

                <button class="submit-button" type="submit">
                  <span class="button-text">Iniciar Sesión</span>
                  <div class="button-glow"></div>
                </button>

                <div class="form-footer">
                  <p className="mb-2">¿No tienes una cuenta?</p>
                  <a class="register-provider-link" href="#" onClick={() => navigate('/register-provider')}>
                    <span>Registrarse como Proveedor</span>
                  </a>
                  <a class="register-customer-link" href="#" onClick={() => navigate('/register-customer')}>
                    <span>Registrarse como Cliente</span>
                  </a>
                </div>
              </form>
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