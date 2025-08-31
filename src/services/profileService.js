import axios from 'axios';

import api from './api';

const API_BASE_URL = 'http://127.0.0.1:8000/profiles';
const API_AUTH_URL = 'http://127.0.0.1:8000/auth';

export const checkProfileStatus = async (token, signal) => {
    const trimmedToken = token.trim();
    const response = await api.get(`profiles/profile-status/`, {
        headers: {
            Authorization: `Bearer ${trimmedToken}`
        },
        signal
    });
    return response.data;
}

export const getProfessions = async (signal) => {
    const response = await api.get(`profiles/professions`, { signal });
    return response.data;
}

export const getCategories = async () => {
    const response = await api.get(`profiles/categories`);
    return response.data;
}

export const getTypeProviders = async (signal) => {
    const response = await api.get(`profiles/type-providers`, { signal });
    return response.data;
}

export const getProviderProfile = async (token) => {
    const response = await api.get(`auth/user/`, { // Asumiendo este endpoint
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}

export const getCustomerProfileData = async (token, signal) => {
    const trimmedToken = token.trim();
    const response = await api.get(`profiles/customer-profile/`,{
        headers: {
            Authorization: `Bearer ${trimmedToken}`
        },
        signal
    });
    return response.data;
}


export const getProviderProfileData = async (token, signal) => {
    const trimmedToken = token.trim();
    const response = await api.get(`profiles/provider-profile/`, {
        headers: {
            Authorization: `Bearer ${trimmedToken}`
        },
        signal
    });
    return response.data;
}

export const getProfile = async (token, signal) => {
    try {
        const trimmedToken = token.trim();
        const response = await api.get(`profiles/profile/`, {
            headers: {
                Authorization: `Bearer ${trimmedToken}`
            },
            signal
        });
        return response.data;
    } catch (error) {
        if (error.name !== 'CanceledError') {
            console.error('Error fetching profile:', error);
        }
        throw error;
    }
}

export const updateUserProfile = async (token, userData) => {
    const response = await api.patch(`auth/update-user/`, userData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}

export const updateProviderProfile = async (token, providerData) => {
    const response = await api.patch(`profiles/provider-profile/`, providerData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}

export const updateProvider = async (token, providerData) => {
    const response = await api.patch(`profiles/provider-profile/update/`, providerData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}


export const updateCustomer = async (token, customerData) => {
    const response = await api.patch(`profiles/customer-profile/update/`, customerData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}


// export const updateCustomer = async (token, customerData) = {
//     const response = await api.patch(`profiles/customer-profile/update/`, customerData, {
//         headers: {
//             Authorization: `Bearer ${token}`
//         }
//     });
//     return response.data;
// }

export const updateProfileImage = (token, formData) => {
    return api.patch(`auth/profile-picture/update/`, formData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    })
}

