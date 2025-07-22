import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import EmailVerificationForm from '../components/loginForm/EmailVerificationForm';

const EmailVerificationPage = () => {
  return (
    <Container fluid className="d-flex align-items-center justify-content-center min-vh-100" style={{ background: 'var(--main-bg)' }}>
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={5} xl={4}>
          <Card className="p-4 shadow-lg" style={{ borderRadius: '1rem' }}>
            <Card.Body>
              <h2 className="mb-4 section-title text-center">Verificar Email</h2>
              <p className="text-center mb-4">
                Se ha enviado un código de verificación a su correo electrónico.
              </p>
              <EmailVerificationForm />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EmailVerificationPage;
