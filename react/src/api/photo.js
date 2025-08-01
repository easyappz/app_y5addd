import { instance } from './axios';

/**
 * Upload a photo
 * @param {FormData} formData - FormData with photo file
 * @returns {Promise<Object>} - Response with message and photoId
 */
export const uploadPhoto = async (formData) => {
  try {
    const response = await instance.post('/api/photo/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw {
      status: error.response?.status || 500,
      message: error.response?.data?.error || 'Ошибка при загрузке фотографии',
      details: error.response?.data?.details || 'Неизвестная ошибка сервера',
    };
  }
};

/**
 * Get photos to rate
 * @param {Object} filters - Filters for photos
 * @param {string} filters.gender - Gender filter (all, male, female)
 * @param {string} filters.age - Age range filter (all, 18-25, 26-35, 36-50, 50+)
 * @returns {Promise<Array<Object>>} - List of photos to rate
 */
export const getPhotosToRate = async (filters = { gender: 'all', age: 'all' }) => {
  try {
    const response = await instance.get('/api/photo/rate', {
      params: {
        gender: filters.gender,
        age: filters.age
      }
    });
    return response.data;
  } catch (error) {
    throw {
      status: error.response?.status || 500,
      message: error.response?.data?.error || 'Не удалось загрузить фотографии для оценки',
      details: error.response?.data?.details || 'Неизвестная ошибка сервера',
    };
  }
};

/**
 * Rate a photo
 * @param {string} photoId - Photo ID
 * @param {number} score - Rating score (1-5)
 * @returns {Promise<Object>} - Response with success message
 */
export const ratePhoto = async (photoId, score) => {
  try {
    const response = await instance.post('/api/photo/rate', { photoId, score });
    return response.data;
  } catch (error) {
    throw {
      status: error.response?.status || 500,
      message: error.response?.data?.error || 'Не удалось сохранить оценку',
      details: error.response?.data?.details || 'Неизвестная ошибка сервера',
    };
  }
};

/**
 * Add photo to evaluated list
 * @param {string} photoId - Photo ID
 * @returns {Promise<Object>} - Response with success message and points
 */
export const addPhotoToEvaluated = async (photoId) => {
  try {
    if (typeof photoId !== 'string' || !photoId.trim()) {
      throw new Error('Invalid photoId: must be a non-empty string');
    }
    // Ensure photoId is a string and not empty
    const id = String(photoId).trim();
    if (!id) {
      throw {
        status: 400,
        message: 'ID фотографии не может быть пустым',
        details: 'Проверьте корректность данных фотографии'
      };
    }
    const response = await instance.post('/api/photo/evaluate/add', { photoId: id });
    return response.data;
  } catch (error) {
    throw {
      status: error.response?.status || error.status || 500,
      message: error.response?.data?.error || error.message || 'Не удалось добавить фотографию в оцененные',
      details: error.response?.data?.details || error.details || 'Неизвестная ошибка сервера',
    };
  }
};

/**
 * Remove photo from evaluated list
 * @param {string} photoId - Photo ID
 * @returns {Promise<Object>} - Response with success message
 */
export const removePhotoFromEvaluated = async (photoId) => {
  try {
    // Ensure photoId is a string and not empty
    const id = String(photoId).trim();
    if (!id) {
      throw {
        status: 400,
        message: 'ID фотографии не может быть пустым',
        details: 'Проверьте корректность данных фотографии'
      };
    }
    const response = await instance.post('/api/photo/evaluate/remove', { photoId: id });
    return response.data;
  } catch (error) {
    throw {
      status: error.response?.status || error.status || 500,
      message: error.response?.data?.error || error.message || 'Не удалось удалить фотографию из оцененных',
      details: error.response?.data?.details || error.details || 'Неизвестная ошибка сервера',
    };
  }
};

/**
 * Get photo statistics
 * @param {string} photoId - Photo ID
 * @returns {Promise<Object>} - Response with photo statistics
 */
export const getPhotoStatistics = async (photoId) => {
  try {
    const id = String(photoId).trim();
    if (!id) {
      throw {
        status: 400,
        message: 'ID фотографии не может быть пустым',
        details: 'Проверьте корректность данных фотографии'
      };
    }
    const response = await instance.get(`/api/photo/statistics/${id}`);
    return response.data;
  } catch (error) {
    throw {
      status: error.response?.status || error.status || 500,
      message: error.response?.data?.error || error.message || 'Не удалось получить статистику фотографии',
      details: error.response?.data?.details || error.details || 'Неизвестная ошибка сервера',
    };
  }
};

/**
 * Get user's uploaded photos
 * @returns {Promise<Object>} - Response with user's photos and points
 */
export const getMyPhotos = async () => {
  try {
    const response = await instance.get('/api/photo/my-photos');
    return response.data;
  } catch (error) {
    throw {
      status: error.response?.status || 500,
      message: error.response?.data?.error || 'Не удалось загрузить ваши фотографии',
      details: error.response?.data?.details || 'Неизвестная ошибка сервера',
    };
  }
};
