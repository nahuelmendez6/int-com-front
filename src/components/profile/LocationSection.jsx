import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { getCities } from '../../services/locationServices';

const LocationSection = ({ provider, onUpdate }) => {
  const [formData, setFormData] = useState({});
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const citiesData = await getCities();
        setCities(citiesData);
      } catch (error) {
        console.error('Error al obtener las ciudades:', error);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    if (provider) {
      setFormData({
        address: provider.address || '',
        cities: provider.cities?.map(c => c.id) || [],
      });
    }
  }, [provider]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCityChange = (e) => {
    const selectedCities = Array.from(e.target.selectedOptions, option => parseInt(option.value));
    setFormData({ ...formData, cities: selectedCities });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <div className="profile-section">
      <h3>Ubicación y Zonas de Trabajo</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Dirección</Form.Label>
          <Form.Control type="text" name="address" value={formData.address?.street || ''} onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Zonas de Trabajo</Form.Label>
          <Form.Select multiple name="cities" value={formData.cities || []} onChange={handleCityChange}>
            {cities.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Form.Select>
        </Form.Group>
        <Button variant="primary" type="submit">Actualizar Ubicación</Button>
      </Form>
    </div>
  );
};

export default LocationSection;
