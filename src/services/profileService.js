import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/profiles';
const API_AUTH_URL = 'http://127.0.0.1:8000/auth';

export const checkProfileStatus = async (token) => {
    const trimmedToken = token.trim();
    const response = await axios.get(`${API_BASE_URL}/profile-status/`, {
        headers: {
            Authorization: `Bearer ${trimmedToken}`
        }
    });
    return response.data;
}

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

export const getProviderProfile = async (token) => {
    const response = await axios.get(`${API_AUTH_URL}/user/`, { // Asumiendo este endpoint
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}

export const getProviderProfileData = async (token) => {
    const trimmedToken = token.trim();
    const response = await axios.get(`${API_BASE_URL}/provider-profile/`, {
        headers: {
            Authorization: `Bearer ${trimmedToken}`
        }
    });
    return response.data;
}

export const getProfile = async (token) => {
    const trimmedToken = token.trim();
    const response = await axios.get(`${API_BASE_URL}/profile/`, {
        headers: {
            Authorization: `Bearer ${trimmedToken}`
        }
    });
    return response.data;
}

export const updateUserProfile = async (token, userData) => {
    const response = await axios.patch(`${API_AUTH_URL}/update-user/`, userData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}

export const updateProviderProfile = async (token, providerData) => {
    const response = await axios.patch(`${API_BASE_URL}/provider-profile/`, providerData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}

export const updateProvider = async (token, providerData) => {
    const response = await axios.patch(`${API_BASE_URL}/provider-profile/update/`, providerData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}


