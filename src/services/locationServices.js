import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/locations';

export const getProvinces = async () => {
    try {
        const response = await axios.get(`${API_URL}/provinces/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching provinces:', error);
        throw error;
    }
};

export const getDepartmentsByProvince = async (provinceId) => {
    try {
        const response = await axios.get(`${API_URL}/departments/?province_id=${provinceId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching departments for province ${provinceId}:`, error);
        throw error;
    }
};

export const getCitiesByDepartment = async (departmentId) => {
    try {
        const response = await axios.get(`${API_URL}/cities/by-department/${departmentId}/`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching cities for department ${departmentId}:`, error);
        throw error;
    }
};

export const getProviderArea = async (providerId) => {
    try {
        const response = await axios.get(`${API_URL}/cities-area/${providerId}/`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching service area for provider ${providerId}:`, error);
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
        const response = await axios.post(`${API_URL}/addresses/`, payload);
        return response.data;
    } catch (error) {
        console.error('Error creating address:', error);
        throw error.response?.data || { detail: 'Error al crear la dirección' };
    }
};

export const getCities = async () => {
    try {
        const response = await axios.get(`${API_URL}/cities/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching cities:', error);
        throw error;
    }
};

export const updateProviderCities = async (token, data) => {
    try {
        const response = await axios.post(
            `${API_URL}/provider-cities/`,
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

