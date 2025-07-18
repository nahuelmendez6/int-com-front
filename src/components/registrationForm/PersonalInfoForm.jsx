import React from 'react';
import { Form } from 'react-bootstrap';

const PersonalInfoForm = ({ formData, handleChange }) => (
  <>
    <Form.Group className="mb-3">
      <Form.Label>Nombre *</Form.Label>
      <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
    </Form.Group>
    <Form.Group className="mb-3">
      <Form.Label>Apellido *</Form.Label>
      <Form.Control type="text" name="lastname" value={formData.lastname} onChange={handleChange} required />
    </Form.Group>
    <Form.Group className="mb-3">
      <Form.Label>Email *</Form.Label>
      <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
    </Form.Group>
    <Form.Group className="mb-3">
      <Form.Label>Contraseña *</Form.Label>
      <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
    </Form.Group>
    <Form.Group className="mb-3">
      <Form.Label>Confirmar Contraseña *</Form.Label>
      <Form.Control type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
    </Form.Group>
  </>
);

export default PersonalInfoForm;
