import React from 'react';
import { Form } from 'react-bootstrap';

const ProviderInfoForm = ({
  formData,
  handleChange,
  categories = [],
  typeProviders = [],
  professions = [],
}) => {
  console.log('ProviderInfoForm received categories:', categories);
  return (
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
        name="type_provider"
        value={formData.type_provider}
        onChange={(e) =>
          handleChange({
            target: {
              name: 'type_provider',
              value: e.target.value,
            },
          })
        }
      >
        <option value="">Seleccioná un tipo</option>
        {typeProviders.map((type) => (
          <option key={type.id_type_provider} value={type.id_type_provider}>
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
        onChange={(e) =>
          handleChange({
            target: {
              name: 'profession',
              value: e.target.value,
            },
          })
        }
      >
        <option value="">Seleccioná una profesión</option>
        {professions.map((prof) => (
          <option key={prof.id_profession} value={prof.id_profession}>
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
        key={cat.id_category}
        type="checkbox"
        label={cat.name}
        value={cat.id_category}
        checked={formData.categories.includes(String(cat.id_category))}
        onChange={(e) => {
          console.log('Current formData.categories before change:', formData.categories);
          const categoryId = String(cat.id_category);
          const isChecked = e.target.checked;
          console.log('Category checkbox changed:', { categoryId, isChecked });
          const newCategories = isChecked
            ? [...formData.categories, categoryId]
            : formData.categories.filter((id) => id !== categoryId);
          console.log('New categories array (before calling handleChange):', newCategories);
          handleChange({ target: { name: 'categories', value: newCategories } });
          console.log('formData.categories after handleChange (may not be immediate):', formData.categories);
        }}
      />
    ))}
  </div>
    </Form.Group>

  </>
);
};

export default ProviderInfoForm;
