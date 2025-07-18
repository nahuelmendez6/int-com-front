import React from 'react';
import { Form } from 'react-bootstrap';

const ProviderInfoForm = ({
  formData,
  handleChange,
  categories = [],
  typeProviders = [],
  professions = [],
}) => (
  <>
    <Form.Group className="mb-3">
      <Form.Label>Descripción</Form.Label>
      <Form.Control
        as="textarea"
        rows={3}
        name="description"
        value={formData.description}
        onChange={handleChange}
      />
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label>Tipo de Proveedor</Form.Label>
      <Form.Select
        name="typeProvider"
        value={formData.typeProvider}
        onChange={handleChange}
      >
        <option value="">Seleccioná un tipo</option>
        {typeProviders.map((type) => (
          <option key={type.id} value={type.id}>
            {type.name}
          </option>
        ))}
      </Form.Select>
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label>Profesión</Form.Label>
      <Form.Select
        name="profession"
        value={formData.profession}
        onChange={handleChange}
      >
        <option value="">Seleccioná una profesión</option>
        {professions.map((prof) => (
          <option key={prof.id} value={prof.id}>
            {prof.name}
          </option>
        ))}
      </Form.Select>
    </Form.Group>

    <Form.Group className="mb-3">
  <Form.Label>Categorías</Form.Label>
  <div>
    {categories.map((cat) => (
      <Form.Check
        key={cat.id}
        type="checkbox"
        label={cat.name}
        value={cat.id}
        checked={formData.categories.includes(String(cat.id))}
        onChange={(e) => {
          const value = e.target.value;
          const isChecked = e.target.checked;
          const newCategories = isChecked
            ? [...formData.categories, value]
            : formData.categories.filter((id) => id !== value);
          handleChange({ target: { name: 'categories', value: newCategories } });
        }}
      />
    ))}
  </div>
    </Form.Group>

  </>
);

export default ProviderInfoForm;
