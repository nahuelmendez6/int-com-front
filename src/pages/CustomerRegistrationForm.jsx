
import React from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import useCustomerRegistrationForm from '../hooks/useCustomerRegistrationForm';

import PersonalInfoForm from '../components/registrationForm/PersonalInfoForm';

const CustomerRegistrationForm = () => {
  const {
    formData,
    handleChange,
    handleSubmit,
    loading,
    errors,
    successMessage,
  } = useCustomerRegistrationForm();

  

  return (
    <Container fluid className="d-flex align-items-center justify-content-center min-vh-100" style={{ background: 'var(--main-bg)' }}>
      <Row className="w-100 justify-content-center">
        <Col md={10} lg={9} xl={8}>
          <Card className="p-4 shadow-lg" style={{ borderRadius: '1rem' }}>
            <Card.Body>
              <h2 className="mb-4 section-title text-center">Registro de Cliente</h2>
              <Form onSubmit={handleSubmit}>
                <PersonalInfoForm formData={formData} handleChange={handleChange} />
                <div className="d-flex justify-content-center mt-4">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Registrando...' : 'Registrarse'}
                  </button>
                </div>
                {errors && <p className="text-danger mt-3 text-center">{errors}</p>}
                {successMessage && <p className="text-success mt-3 text-center">{successMessage}</p>}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CustomerRegistrationForm;
