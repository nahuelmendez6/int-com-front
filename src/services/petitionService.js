import api from './api';

export const createPetition = async (petitionData) => {
  try {
    const response = await api.post('/petitions/', petitionData);
    return response.data;
  } catch (error) {
    console.error('Error creating petition:', error);
    throw error;
  }
};

export const getPetitionTypes = async () => {
  try {
    const response = await api.get('/petitions/type-petitions/');
    return response.data;
  } catch (error) {
    console.error('Error fetching petition types:', error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await api.get('/profiles/categories/');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getPetitionsByCustomer = async (customerId) => {
  try {
    const response = await api.get(`/petitions/customer/${customerId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching petitions by customer:', error);
    throw error;
  }
};

export const getPetitions = async () => {
  try {
    const response = await api.get('/petitions/');
    return response.data;
  } catch (error) {
    console.error('Error fetching petitions:', error);
    throw error;
  }
};
