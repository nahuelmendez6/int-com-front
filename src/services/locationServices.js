import axios from 'axios';
import api from './api';
// const API_URL = 'http://127.0.0.1:8000/locations';

export const getProvinces = async () => {
    try {
        const response = await api.get('locations/provinces/');
        return response.data;
    } catch (error) {
        console.error('Error fetching provinces:', error);
        throw error;
    }
};

export const getDepartmentsByProvince = async (provinceId) => {
    try {
        const response = await api.get('locations/departments/?province_id=${provinceId}');
        return response.data;
    } catch (error) {
        console.error(`Error fetching departments for province ${provinceId}:`, error);
        throw error;
    }
};

export const getCitiesByDepartment = async (departmentId) => {
    try {
        const response = await api.get(`locations/cities/by-department/${departmentId}/`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching cities for department ${departmentId}:`, error);
        throw error;
    }
};

export const getProviderArea = async (providerId, signal) => {
    try {
        const response = await api.get(`locations/cities-area/${providerId}/`, { signal });
        return response.data;
    } catch (error) {
        if (error.name !== 'CanceledError') {
            console.error(`Error fetching service area for provider ${providerId}:`, error);
        }
        throw error;
    }
};

export const createAddress = async (addressData) => {
    try {
        const payload = {
            street: addressData.street,
            number: addressData.number,
            floor: addressData.floor,
            apartment: addressData.apartment,
            postal_code: addressData.postal_code,
            city: addressData.city,
        };
        console.log('Payload for createAddress:', payload);
        const response = await api.post(`locations/addresses/`, payload);
        return response.data;
0    } catch (error) {
        console.error('Error creating address:', error);
        throw error.response?.data || { detail: 'Error al crear la dirección' };
    }
};

export const getCities = async () => {
    try {
        const response = await api.get(`locations/cities/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching cities:', error);
        throw error;
    }
};

export const updateProviderCities = async (token, data) => {
    try {
        const response = await api.post(
            `/locations/provider-cities/`,
            data,
            {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating provider cities:', error.response?.data || error);
        throw error;
    }
};

export const removeCityFromProviderArea = async (token, providerId, cityId) => {
    try {
        // Corrected endpoint based on user feedback
        // const API_BASE_URL = 'http://127.0.0.1:8000'; 
        const response = await api.delete(`locations/providers/${providerId}/cities/${cityId}/`, {
            headers: {
                Authorization: `Token ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error removing city ${cityId} from provider ${providerId}:`, error.response?.data || error);
        throw error;
    }
};