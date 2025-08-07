import React, { useState, useEffect } from 'react';
import { Button, Modal, Card, ListGroup, Badge } from 'react-bootstrap';
import { FiEdit } from 'react-icons/fi';
import { getProfessions, getCategories, getTypeProviders, getProviderProfileData, updateProvider } from '../../services/profileService';
import { useAuth } from '../../context/AuthContext';
import ProviderInfoForm from '../registrationForm/ProviderInfoForm';
import './ProfessionalInfoSection.css';

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
      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Card.Title>Información Profesional</Card.Title>
            <Button variant="light" onClick={handleShow} className="edit-button">
              <FiEdit />
            </Button>
          </div>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <strong>Profesión:</strong> {provider?.profession?.name}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Tipo de Proveedor:</strong> {provider?.type_provider?.name}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Categorías:</strong>
              <div>
                {provider?.categories?.map(c => (
                  <Badge pill bg="primary" key={c.id_category} className="me-1 mb-1">
                    {c.name}
                  </Badge>
                ))}
              </div>
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Descripción:</strong> {provider?.description}
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>

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
