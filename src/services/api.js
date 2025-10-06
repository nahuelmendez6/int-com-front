import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
    timeout: 30000, // Aumentado a 30s para evitar timeouts
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            console.warn('Token inválido o expirado');
            // Limpiar datos de sesión y redirigir al login
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('role');
            localStorage.removeItem('userId');
            localStorage.removeItem('user');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default api;