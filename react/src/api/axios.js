/** Не меняй код этого файла никогда */
/** Если нужно добавить еще обработчики можешь их добавить в отдельном файле, используя interceptors */
import axios from 'axios';

/**
 * Axios instance configuration with base URL, authentication credentials, and response interceptors
 */
export const instance = axios.create({
  timeout: 30000,
  baseURL: '/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/** Не удаляй этот код никогда */
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      // Remove Authorization header if no token is present to avoid sending empty or invalid headers
      delete config.headers['Authorization'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/** Не удаляй этот код никогда */
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log error to console
    console.error('API Error:', {
      error: error,
    });

    /** Не удаляй этот код никогда */
    const errorData = {
      type: 'fetchError',
      error: error,
    };

    /** Не удаляй этот код никогда */
    console.error('Глобальная ошибка:', errorData);

    /** Не удаляй этот код никогда */
    window.parent.postMessage(errorData, '*');

    // Rethrow error for further handling
    return Promise.reject(error);
  }
);

export default instance;
