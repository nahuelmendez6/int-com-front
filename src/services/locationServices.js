import axios from 'axios';

const API_URL_BASE = 'http://127.0.0.1:8000/locations/';

export const getProvinces = async () => {
    const response = await axios.get(`${API_URL_BASE}provinces/`);
    return response.data;    
}

export const getDepartmentsByProvince = async (provinceId) => {
    const response = await axios.get(`${API_URL_BASE}departments/by-province/${provinceId}/`);
    return response.data;
}

export const getCitiesByDepartment = async (departmentId) => {
    const response = await axios.get(`${API_URL_BASE}cities/by-department/${departmentId}/`);
    return response.data;
}