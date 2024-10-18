import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080', // caso teje testando muda essa rota aqui pro axios
});

// interceptor para adicionar o token nas requisições, se necessário
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
