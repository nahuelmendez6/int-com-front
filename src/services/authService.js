import axios from "axios";

const API_URL = 'http://127.0.0.1:8000/auth';


export const registerUser = async (formData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/register-user/`, formData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { detail: 'Error al registrar usuario' };
    }
};