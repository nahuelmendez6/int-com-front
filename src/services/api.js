import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
    timeout: 15000,
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
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
    }
    return Promise.reject(error);
}
);

export default api;