import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { getProfessions, getCategories, getTypeProviders } from '../../services/profileService';

const ProfessionalInfoSection = ({ provider, onUpdate }) => {
  const [formData, setFormData] = useState({});
  const [professions, setProfessions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [typeProviders, setTypeProviders] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const professionsData = await getProfessions();
        setProfessions(professionsData);
        const categoriesData = await getCategories();
        setCategories(categoriesData);
        const typeProvidersData = await getTypeProviders();
        setTypeProviders(typeProvidersData);
      } catch (error) {
        console.error('Error al obtener las opciones:', error);
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    if (provider) {
      setFormData({
        profession: provider.profession?.id || '',
        type_provider: provider.type_provider?.id || '',
        categories: provider.categories?.map(c => c.id) || [],
      });
    }
  }, [provider]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e) => {
    const selectedCategories = Array.from(e.target.selectedOptions, option => parseInt(option.value));
    setFormData({ ...formData, categories: selectedCategories });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <div className="profile-section">
      <h3>Información Profesional</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Profesión</Form.Label>
          <Form.Select name="profession" value={formData.profession || ''} onChange={handleChange}>
            <option value="">Seleccione una profesión</option>
            {professions.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Tipo de Proveedor</Form.Label>
          <Form.Select name="type_provider" value={formData.type_provider || ''} onChange={handleChange}>
            <option value="">Seleccione un tipo</option>
            {typeProviders.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Categorías</Form.Label>
          <Form.Select multiple name="categories" value={formData.categories || []} onChange={handleCategoryChange}>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Form.Select>
        </Form.Group>
        <Button variant="primary" type="submit">Actualizar Información</Button>
      </Form>
    </div>
  );
};

export default ProfessionalInfoSection;
