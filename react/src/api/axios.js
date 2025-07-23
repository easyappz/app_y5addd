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
    console.log('request', { config });

    const getCallerInfo = () => {
      try {
        throw new Error();
      } catch (e) {
        const stackLines = e.stack.split('\n');
        // Анализируем стек вызовов чтобы найти полезную информацию
        return stackLines.slice(2, 4).join(' | ');
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      // Remove Authorization header if no token is present to avoid sending empty or invalid headers
      delete config.headers['Authorization'];
    }

    // Добавляем информацию о вызывающем коде в errorData
    config._caller = getCallerInfo();
  
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
    console.error('API Error:', error);

    /** Не удаляй этот код никогда */
    const errorData = {
      type: 'fetchError',
      url: error.config?.url,
      request: {
        headers: error.config?.headers,
        data: error.config?.data,
      },
      response: {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        message: error.message,
      },
      pathname: window?.location?.pathname,
      caller: error.config?._caller,
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
