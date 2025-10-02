import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const ProviderInfoForm = ({
  formData,
  handleChange,
  categories = [],
  typeProviders = [],
  professions = [],
}) => {

  return (
  <>
    <Row>
        <Col md={6}>
            <Form.Group className="mb-3">
            <Form.Label>Tipo de Proveedor</Form.Label>
            <Form.Select
                name="type_provider"
                value={formData.type_provider}
                onChange={handleChange}
            >
                <option value="">Seleccioná un tipo</option>
                {typeProviders.map((type) => (
                <option key={type.id_type_provider} value={type.id_type_provider}>
                    {type.name}
                </option>
                ))}
            </Form.Select>
            </Form.Group>
        </Col>
        <Col md={6}>
            <Form.Group className="mb-3">
            <Form.Label>Profesión</Form.Label>
            <Form.Select
                name="profession"
                value={formData.profession}
                onChange={handleChange}
            >
                <option value="">Seleccioná una profesión</option>
                {professions.map((prof) => (
                <option key={prof.id_profession} value={prof.id_profession}>
                    {prof.name}
                </option>
                ))}
            </Form.Select>
            </Form.Group>
        </Col>
    </Row>

    <Form.Group className="mb-3">
      <Form.Label>Descripción</Form.Label>
      <Form.Control
        as="textarea"
        rows={2}
        name="description"
        value={formData.description}
        onChange={handleChange}
      />
    </Form.Group>

    <Form.Group className="mb-3">
        <Form.Label>Categorías</Form.Label>
        <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #dee2e6', padding: '10px' }}>
            <Row>
                {categories.map((cat) => (
                <Col md={4} key={cat.id_category}>
                    <Form.Check
                        type="checkbox"
                        label={cat.name}
                        value={cat.id_category}
                        checked={formData.categories.includes(cat.id_category)}
                        onChange={(e) => {
                            const categoryId = cat.id_category;
                            const newCategories = e.target.checked
                            ? [...formData.categories, categoryId]
                            : formData.categories.filter((id) => id !== categoryId);
                            handleChange({ target: { name: 'categories', value: newCategories } });
                        }}
                    />
                </Col>
                ))}
            </Row>
        </div>
    </Form.Group>
  </>
);
};

export default ProviderInfoForm;
