import axios from "axios";

const API_URL = 'http://127.0.0.1:8000/auth';


export const registerUser = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/register-user/`, formData);
        return response.data;
    } catch (error) {
        console.error('Error axios:', error.response);
    throw error.response?.data || { detail: 'Error al registrar usuario' };
    }
};

export const login = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/login/`, credentials, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        return response.data;
    } catch (error) {
        console.error('Error axios:', error.response);
        throw error.response?.data || { detail: 'Error al iniciar sesión' };
    }
};


export const verifyCode = async (code) => {
    try {
        const response = await axios.post(`${API_URL}/verify-code/`, code);
        return response.data;
    } catch (error) {
        console.error('Error axios:', error.response);
        throw error.response?.data || { detail: 'Error al verificar el código' };
    }
}