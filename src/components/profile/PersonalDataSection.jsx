import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

const PersonalDataSection = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        lastname: user.lastname || '',
        email: user.email || ''
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
      {/* <h3>Datos Personales</h3> */}
      <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px', maxWidth: '400px', backgroundColor: '#f9f9f9' }}>
        <h5 style={{ marginBottom: '1rem' }}>Datos del Usuario</h5>
        <div><strong>Nombre:</strong> {user.name}</div>
        <div><strong>Apellido:</strong> {user.lastname}</div>
        <div><strong>Email:</strong> {user.email}</div>
      </div>

      {/* <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Apellido</Form.Label>
          <Form.Control type="text" name="lastname" value={formData.lastname} onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} />
        </Form.Group>
        <Button variant="primary" type="submit">Actualizar Datos</Button>
      </Form> */}
    </div>
  );
};

export default PersonalDataSection;
