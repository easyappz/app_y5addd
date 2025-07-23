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
  const response = await instance.get('/api/photo/rate', {
    params: {
      gender: filters.gender,
      age: filters.age
    }
  });
  return response.data;
};

/**
 * Rate a photo
 * @param {string} photoId - Photo ID
 * @param {number} score - Rating score (1-5)
 * @returns {Promise<Object>} - Response with success message
 */
export const ratePhoto = async (photoId, score) => {
  const response = await instance.post('/api/photo/rate', { photoId, score });
  return response.data;
};

/**
 * Add photo to evaluated list
 * @param {string} photoId - Photo ID
 * @returns {Promise<Object>} - Response with success message
 */
export const addPhotoToEvaluated = async (photoId) => {
  const response = await instance.post('/api/photo/evaluate/add', { photoId });
  return response.data;
};

/**
 * Remove photo from evaluated list
 * @param {string} photoId - Photo ID
 * @returns {Promise<Object>} - Response with success message
 */
export const removePhotoFromEvaluated = async (photoId) => {
  const response = await instance.post('/api/photo/evaluate/remove', { photoId });
  return response.data;
};

/**
 * Get photo statistics
 * @param {string} photoId - Photo ID
 * @returns {Promise<Object>} - Response with photo statistics
 */
export const getPhotoStatistics = async (photoId) => {
  const response = await instance.get(`/api/photo/statistics/${photoId}`);
  return response.data;
};
