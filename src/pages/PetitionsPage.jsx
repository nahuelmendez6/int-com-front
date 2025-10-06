import React, { useState, useEffect, useCallback } from 'react';
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
  const { profile } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setEditingPetition(null);
    setIsModalOpen(true);
  };

  const fetchPetitions = useCallback(async () => {
    try {
      const [petitionsData, professionsData, categoriesData, providerTypesData] = await Promise.all([
        getPetitions(),
        getProfessions(),
        getCategories(),
        getTypeProviders(),
      ]);
      setPetitions(petitionsData.filter(p => !p.is_deleted));
      setProfessions(professionsData);
      setCategories(categoriesData);
      setProviderTypes(providerTypesData);
    } catch (error) {
      console.error('Error fetching data:', error);
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

  const getProfessionName = (id) => {
    const profession = professions.find(p => p.id_profession === id);
    return profession ? profession.name : 'N/A';
  };

  const getCategoryNames = (categoryIds) => {
    if (!categoryIds || categoryIds.length === 0) return 'N/A';
    return categoryIds.map(catId => {
      const category = categories.find(c => c.id_category === catId.id_category);
      return category ? category.name : 'N/A';
    }).join(', ');
  };

  const getProviderTypeName = (id) => {
    const providerType = providerTypes.find(pt => pt.id_type_provider === id);
    return providerType ? providerType.name : 'N/A';
  };

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
      <div className="petitions-list">
        {petitions.map(petition => (
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
        ))}
      </div>
    </Layout>
  );
};

export default PetitionsPage;
