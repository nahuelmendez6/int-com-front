import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyCode } from '../../services/authService';

const EmailVerificationForm = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await verifyCode({ email, code });
      setSuccess(response.message);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Error al verificar el código');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form.Group controlId="formBasicCode">
        <Form.Label>Código de Verificación</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ingrese el código"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
      </Form.Group>
      <Button variant="primary" type="submit" disabled={loading} block>
        {loading ? 'Verificando...' : 'Verificar'}
      </Button>
    </Form>
  );
};

export default EmailVerificationForm;
