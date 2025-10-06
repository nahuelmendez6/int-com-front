import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/layout/Layout';
import { getPetitions } from '../services/petitionService';
import { useAuth } from '../context/AuthContext';
import CreatePetitionForm from '../components/petitions/CreatePetitionForm';
import './PetitionsPage.css';

const PetitionsPage = () => {
  const [petitions, setPetitions] = useState([]);
  const { profile, customerProfile } = useAuth(); // Changed from user to profile
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log(profile)

  const handleOpenModal = () => setIsModalOpen(true);

  const fetchPetitions = useCallback(async () => {
    try {
      const data = await getPetitions();
      setPetitions(data);
    } catch (error) {
      console.error('Error fetching petitions:', error);
    }
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    fetchPetitions(); // Refresh petitions after closing the modal
  };

  useEffect(() => {
    if (profile) { // Check if profile exists
      fetchPetitions();
    }
  }, [profile, fetchPetitions]); // Changed from user to profile

  return (
    <Layout centered={false}>
      <div className="flex items-center gap-4 mb-4">
        <button onClick={handleOpenModal} className="create-petition-btn">
          Crear Petición
          <span></span>
        </button>
      </div>

      {isModalOpen && <CreatePetitionForm show={isModalOpen} onHide={handleCloseModal} profile={profile} customerProfile={customerProfile} />}
      
      <h1 className="text-2xl font-semibold mb-4">Mis Peticiones</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {petitions.map(petition => (
          <div key={petition.id_petition} className="card card-cliente p-4 mb-4">
            <h5 className="card-title">{petition.description}</h5>
            <p className="card-text">Desde: {new Date(petition.date_since).toLocaleDateString()}</p>
            <p className="card-text">Hasta: {new Date(petition.date_until).toLocaleDateString()}</p>
            {/* The following fields are not available in the petition object */}
            {/* <p className="card-text">Categoría: </p> */}
            {/* <p className="card-text">Dirección: </p> */}
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default PetitionsPage;
