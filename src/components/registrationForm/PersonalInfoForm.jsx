import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const PersonalInfoForm = ({ formData, handleChange }) => (
  <>
    <Row className="mb-3">
      <Form.Group as={Col} md="6">
        <Form.Label>Nombre *</Form.Label>
        <Form.Control
          required
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          size="sm"
          className="rounded-pill"
        />
      </Form.Group>
      <Form.Group as={Col} md="6">
        <Form.Label>Apellido *</Form.Label>
        <Form.Control
          required
          type="text"
          name="lastname"
          value={formData.lastname}
          onChange={handleChange}
          size="sm"
          className="rounded-pill"
        />
      </Form.Group>
    </Row>
    <Form.Group className="mb-3">
      <Form.Label>Email *</Form.Label>
      <Form.Control
        required
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        size="sm"
        className="rounded-pill"
      />
    </Form.Group>
    <Row className="mb-3">
      <Form.Group as={Col} md="6">
        <Form.Label>Contraseña *</Form.Label>
        <Form.Control
          required
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          size="sm"
          className="rounded-pill"
        />
      </Form.Group>
      <Form.Group as={Col} md="6">
        <Form.Label>Confirmar Contraseña *</Form.Label>
        <Form.Control
          required
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          size="sm"
          className="rounded-pill"
        />
      </Form.Group>
    </Row>
  </>
);

export default PersonalInfoForm;
