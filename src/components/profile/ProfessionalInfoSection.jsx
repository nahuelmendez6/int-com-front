import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button, Modal, Card, ListGroup, Badge, Row, Col, Spinner } from 'react-bootstrap';
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
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState(null);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const fetchOptions = useCallback(async () => {
    const controller = new AbortController();
    const signal = controller.signal;

    try {
      setIsLoadingData(true);
      setError(null);
      
      // Hacer todas las llamadas en paralelo para mejor rendimiento
      const [professionsData, categoriesData, typeProvidersData] = await Promise.all([
        getProfessions(signal),
        getCategories(),
        getTypeProviders(signal)
      ]);
      
      setProfessions(professionsData);
      setCategories(categoriesData);
      setTypeProviders(typeProvidersData);
      
      console.log('Professions data:', professionsData);
      console.log('Categories data:', categoriesData);
      console.log('Type Providers data:', typeProvidersData);
    } catch (error) {
      if (error.name !== 'CanceledError') {
        console.error('Error al obtener las opciones:', error);
        setError('Error al cargar los datos. Por favor, intenta de nuevo.');
      }
    } finally {
      setIsLoadingData(false);
    }

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchProviderData = async () => {
      try {
        const providerData = await getProviderProfileData(token, signal);
        console.log('Provider Data Categories:', providerData.categories);
        setFormData({
          profession: providerData.profession?.id_profession || '',
          type_provider: providerData.type_provider?.id_type_provider || '',
          categories: providerData.categories?.map(c => c.id_category) || [],
          description: providerData.description || ''
        });
      } catch (error) {
        if (error.name !== 'CanceledError') {
          console.error('Error fetching provider data:', error);
        }
      }
    };

    if (token && !isLoading) {
      fetchProviderData();
    }

    return () => {
      controller.abort();
    };
  }, [token, isLoading]); // Dependencies for provider data fetching

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      profession: formData.profession ? parseInt(formData.profession, 10) : null,
      type_provider: formData.type_provider ? parseInt(formData.type_provider, 10) : null,
    };

    try {
      await updateProvider(token, payload);
      onUpdate();
      handleClose();
    } catch (error) {
      console.error('Error updating provider data:', error);
    }
  }, [formData, token, onUpdate]);

  // Memoizar las funciones de búsqueda
  const getProfessionName = useCallback((id) => {
    const profession = professions.find(p => p.id_profession === id);
    return profession ? profession.name : 'N/A';
  }, [professions]);

  const getCategoryNames = useCallback((categoryIds) => {
    if (!categoryIds || categoryIds.length === 0) return 'N/A';
    return categoryIds.map(catId => {
      const category = categories.find(c => c.id_category === catId);
      return category ? category.name : 'N/A';
    }).join(', ');
  }, [categories]);

  const getProviderTypeName = useCallback((id) => {
    const providerType = typeProviders.find(pt => pt.id_type_provider === id);
    return providerType ? providerType.name : 'N/A';
  }, [typeProviders]);

  // Mostrar loading state
  if (isLoadingData) {
    return (
      <div className="profile-section">
        <Card>
          <Card.Body>
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
              <div className="text-center">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </Spinner>
                <p className="mt-3">Cargando información profesional...</p>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  }

  // Mostrar error state
  if (error) {
    return (
      <div className="profile-section">
        <Card>
          <Card.Body>
            <div className="alert alert-danger" role="alert">
              <h4 className="alert-heading">Error</h4>
              <p>{error}</p>
              <hr />
              <button className="btn btn-outline-danger" onClick={fetchOptions}>
                Reintentar
              </button>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  }

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
              <Row>
                <Col sm={3}><strong>Profesión:</strong></Col>
                <Col sm={9}>{provider?.profession?.name}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col sm={3}><strong>Tipo de Proveedor:</strong></Col>
                <Col sm={9}>{provider?.type_provider?.name}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col sm={3}><strong>Categorías:</strong></Col>
                <Col sm={9}>
                  {provider?.categories?.map(c => (
                    <Badge pill bg="primary" key={c.id_category} className="me-1 mb-1">
                      {c.name}
                    </Badge>
                  ))}
                </Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col sm={3}><strong>Descripción:</strong></Col>
                <Col sm={9}>{provider?.description}</Col>
              </Row>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleClose} size="xl">
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
