import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Layout from '../components/layout/Layout';
import { getPetitions, getPetition, updatePetition } from '../services/petitionService';
import { getProfessions, getCategories, getTypeProviders } from '../services/profileService';
import { useAuth } from '../context/AuthContext';
import CreatePetitionForm from '../components/petitions/CreatePetitionForm';
import ConfirmationModal from '../components/common/ConfirmationModal';
import './PetitionsPage.css';

const PetitionsPage = () => {
  const [petitions, setPetitions] = useState([]);
  const [professions, setProfessions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [providerTypes, setProviderTypes] = useState([]);
  const [editingPetition, setEditingPetition] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [petitionToDelete, setPetitionToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingReference, setIsLoadingReference] = useState(false);
  const [error, setError] = useState(null);
  const { profile } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setEditingPetition(null);
    setIsModalOpen(true);
  };

  const fetchPetitions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Cargar datos de forma progresiva para mejor UX
      console.log('Cargando datos de peticiones...');
      
      // Primero cargar las peticiones (más importante)
      const petitionsData = await getPetitions();
      setPetitions(petitionsData.filter(p => !p.is_deleted));
      
      // Marcar que las peticiones están cargadas
      setIsLoading(false);
      
      // Luego cargar los datos de referencia en paralelo
      console.log('Cargando datos de referencia...');
      setIsLoadingReference(true);
      
      const [professionsData, categoriesData, providerTypesData] = await Promise.all([
        getProfessions(),
        getCategories(),
        getTypeProviders(),
      ]);
      
      setProfessions(professionsData);
      setCategories(categoriesData);
      setProviderTypes(providerTypesData);
      setIsLoadingReference(false);
      
      console.log('Datos cargados exitosamente');
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.code === 'ECONNABORTED') {
        setError('La conexión está tardando mucho. Verifica tu conexión a internet e intenta de nuevo.');
      } else {
        setError('Error al cargar los datos. Por favor, intenta de nuevo.');
      }
    } finally {
      setIsLoading(false);
      setIsLoadingReference(false);
    }
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPetition(null);
    fetchPetitions(); // Refresh petitions after closing the modal
  };

  useEffect(() => {
    if (profile) { // Check if profile exists
      fetchPetitions();
    }
  }, [profile, fetchPetitions]);

  // Memoizar las funciones de búsqueda para mejor rendimiento
  const getProfessionName = useCallback((id) => {
    if (isLoadingReference) return 'Cargando...';
    const profession = professions.find(p => p.id_profession === id);
    return profession ? profession.name : 'N/A';
  }, [professions, isLoadingReference]);

  const getCategoryNames = useCallback((categoryIds) => {
    if (isLoadingReference) return 'Cargando...';
    if (!categoryIds || categoryIds.length === 0) return 'N/A';
    return categoryIds.map(catId => {
      const category = categories.find(c => c.id_category === catId.id_category);
      return category ? category.name : 'N/A';
    }).join(', ');
  }, [categories, isLoadingReference]);

  const getProviderTypeName = useCallback((id) => {
    if (isLoadingReference) return 'Cargando...';
    const providerType = providerTypes.find(pt => pt.id_type_provider === id);
    return providerType ? providerType.name : 'N/A';
  }, [providerTypes, isLoadingReference]);

  // Memoizar las peticiones filtradas
  const filteredPetitions = useMemo(() => {
    return petitions.filter(p => !p.is_deleted);
  }, [petitions]);

  const handleEdit = async (id) => {
    try {
      const petitionToEdit = await getPetition(id);
      setEditingPetition(petitionToEdit);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching petition for edit:', error);
    }
  };

  const handleDelete = (id) => {
    setPetitionToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (petitionToDelete) {
      try {
        await updatePetition(petitionToDelete, { is_deleted: true });
        setShowDeleteModal(false);
        setPetitionToDelete(null);
        fetchPetitions();
      } catch (error) {
        console.error('Error deleting petition:', error);
      }
    }
  };

  // Mostrar loading state
  if (isLoading) {
    return (
      <Layout centered={false}>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3">Cargando peticiones...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Mostrar error state
  if (error) {
    return (
      <Layout centered={false}>
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error</h4>
          <p>{error}</p>
          <hr />
          <button className="btn btn-outline-danger" onClick={fetchPetitions}>
            Reintentar
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout centered={false}>
      <div className="flex items-center gap-4 mb-4">
        <button onClick={handleOpenModal} className="create-petition-btn">
          Crear Petición
          <span></span>
        </button>
      </div>

      {isModalOpen && <CreatePetitionForm show={isModalOpen} onHide={handleCloseModal} petitionToEdit={editingPetition} />}

      <ConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        body="¿Estás seguro de que quieres eliminar esta petición?"
      />
      
      <h1 className="text-2xl font-semibold mb-4">Mis Peticiones</h1>
      
      {/* Indicador de carga de datos de referencia */}
      {isLoadingReference && (
        <div className="alert alert-info d-flex align-items-center" role="alert">
          <div className="spinner-border spinner-border-sm me-2" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          Cargando información adicional...
        </div>
      )}
      
      <div className="petitions-list">
        {filteredPetitions.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">No tienes peticiones creadas.</p>
            <button onClick={handleOpenModal} className="btn btn-primary">
              Crear tu primera petición
            </button>
          </div>
        ) : (
          filteredPetitions.map(petition => (
          <div key={petition.id_petition} className="petition-card-modern">
            <div className="card-header-modern">
              <h5>{petition.description}</h5>
              <div className="petition-actions">
                <button onClick={() => handleEdit(petition.id_petition)} className="btn-edit">Editar</button>
                <button onClick={() => handleDelete(petition.id_petition)} className="btn-delete">Eliminar</button>
              </div>
            </div>
            <div className="card-body-modern">
              <div className="petition-details-grid">
                <p><strong>Profesión:</strong> {getProfessionName(petition.id_profession)}</p>
                <p><strong>Categorías:</strong> {getCategoryNames(petition.categories)}</p>
                <p><strong>Vence:</strong> {new Date(petition.date_until).toLocaleDateString()}</p>
                <p><strong>Tipo de Proveedor:</strong> {getProviderTypeName(petition.id_type_provider)}</p>
              </div>
              {petition.attachments && petition.attachments.length > 0 &&
                <div className="attachments-section">
                  <strong>Adjuntos:</strong>
                  <ul>
                    {petition.attachments.map(att => (
                      <li key={att.id_petition_attachment}>
                        <a href={`http://localhost:8000${att.file}`} target="_blank" rel="noopener noreferrer">Ver adjunto</a>
                      </li>
                    ))}
                  </ul>
                </div>
              }
            </div>
          </div>
          ))
        )}
      </div>
    </Layout>
  );
};

export default PetitionsPage;
