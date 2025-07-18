import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/profiles';


export const getProfessions = async () => {
    const response = await axios.get(`${API_BASE_URL}/professions`);
    return response.data;
}

export const getCategories = async () => {
    const response = await axios.get(`${API_BASE_URL}/categories`);
    return response.data;
}

export const getTypeProviders = async () => {
    const response = await axios.get(`${API_BASE_URL}/type-providers`);
    return response.data;
}