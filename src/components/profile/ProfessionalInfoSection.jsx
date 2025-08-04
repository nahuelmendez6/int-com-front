import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { getProfessions, getCategories, getTypeProviders, getProviderProfileData, updateProvider } from '../../services/profileService';
import { useAuth } from '../../context/AuthContext';
import ProviderInfoForm from '../registrationForm/ProviderInfoForm';

const ProfessionalInfoSection = ({ provider, onUpdate }) => {
  const { token, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    profession: '',
    type_provider: '',
    categories: [],
    description: ''
  });
  const [professions, setProfessions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [typeProviders, setTypeProviders] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

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

    const fetchProviderData = async () => {
      try {
        const providerData = await getProviderProfileData(token);
        setFormData({
          profession: providerData.profession?.id_profession || '',
          type_provider: providerData.type_provider?.id_type_provider || '',
          categories: providerData.categories?.map(c => c.id_category) || [],
          description: providerData.description || ''
        });
      } catch (error) {
        console.error('Error fetching provider data:', error);
      }
    };

    fetchOptions();
    if (token && !isLoading) {
      fetchProviderData();
    }
  }, [token, isLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProvider(token, formData);
      onUpdate();
      handleClose();
    } catch (error) {
      console.error('Error updating provider data:', error);
    }
  };

  return (
    <div className="profile-section">
      {/* <h3>Información Profesional</h3> */}
      <div>
        <p><strong>Profesión:</strong> {provider?.profession?.name}</p>
        <p><strong>Tipo de Proveedor:</strong> {provider?.type_provider?.name}</p>
        <p><strong>Categorías:</strong> {provider?.categories?.map(c => c.name).join(', ')}</p>
        <p><strong>Descripción:</strong> {provider?.description}</p>
      </div>
      <Button variant="primary" onClick={handleShow}>Editar</Button>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Información Profesional</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProviderInfoForm
            formData={formData}
            handleChange={handleChange}
            categories={categories}
            typeProviders={typeProviders}
            professions={professions}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProfessionalInfoSection;
