import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

const PersonalDataSection = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <div className="profile-section">
      <h3>Datos Personales</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control type="text" value={user?.name || ''} disabled />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Apellido</Form.Label>
          <Form.Control type="text" value={user?.lastname || ''} disabled />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" value={formData.email || ''} onChange={handleChange} />
        </Form.Group>
        <Button variant="primary" type="submit">Actualizar Datos</Button>
      </Form>
    </div>
  );
};

export default PersonalDataSection;
