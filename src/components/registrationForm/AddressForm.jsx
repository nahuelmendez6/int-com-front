import React from 'react';
import { Form } from 'react-bootstrap';

const AddressForm = ({
  formData,
  provinces,
  departments,
  cities,
  handleChange,
  handleProvinceChange,
  handleDepartmentChange,
}) => (
  <>
    <Form.Group className="mb-3">
      <Form.Label>Calle</Form.Label>
      <Form.Control type="text" name="address.street" value={formData.address.street} onChange={handleChange} />
    </Form.Group>
    <Form.Group className="mb-3">
      <Form.Label>Número</Form.Label>
      <Form.Control type="text" name="address.number" value={formData.address.number} onChange={handleChange} />
    </Form.Group>
    <Form.Group className="mb-3">
      <Form.Label>Piso</Form.Label>
      <Form.Control type="text" name="address.floor" value={formData.address.floor} onChange={handleChange} />
    </Form.Group>
    <Form.Group className="mb-3">
      <Form.Label>Departamento</Form.Label>
      <Form.Control type="text" name="address.apartment" value={formData.address.apartment} onChange={handleChange} />
    </Form.Group>
    <Form.Group className="mb-3">
      <Form.Label>Código Postal</Form.Label>
      <Form.Control type="text" name="address.postal_code" value={formData.address.postal_code} onChange={handleChange} />
    </Form.Group>

    <Form.Select name="address.province" value={formData.address.province} onChange={handleProvinceChange}>
      <option value="">Seleccione una provincia</option>
      {provinces.map((p) => (
        <option key={p.id_province} value={p.id_province}>{p.name}</option>
      ))}
    </Form.Select>

    <Form.Group className="mb-3">
      <Form.Label>Departamento</Form.Label>
      <Form.Select name="address.department" value={formData.address.department} onChange={handleDepartmentChange}>
        <option value="">Seleccione un departamento</option>
        {departments.map((d) => (
          <option key={d.id_department} value={d.id_department}>{d.name}</option>
        ))}
      </Form.Select>
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label>Ciudad</Form.Label>
      <Form.Select name="address.city" value={formData.city} onChange={handleChange}>
        <option value="">Seleccione una ciudad</option>
        {cities.map((c) => (
          <option key={c.id_city} value={c.id_city}>{c.name}</option>
        ))}
      </Form.Select>
    </Form.Group>
  </>
);

export default AddressForm;
