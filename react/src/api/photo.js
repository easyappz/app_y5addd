import { instance } from './axios';

/**
 * Upload a photo
 * @param {FormData} formData - FormData with photo file
 * @returns {Promise<Object>} - Response with message and photoId
 */
export const uploadPhoto = async (formData) => {
  const response = await instance.post('/api/photo/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Get photos to rate
 * @returns {Promise<Array<Object>>} - List of photos to rate
 */
export const getPhotosToRate = async () => {
  const response = await instance.get('/api/photo/rate');
  return response.data;
};

/**
 * Rate a photo
 * @param {Object} data - Rating data
 * @param {string} data.photoId - Photo ID
 * @param {number} data.score - Rating score (1-5)
 * @returns {Promise<Object>} - Response with success message
 */
export const ratePhoto = async (data) => {
  const response = await instance.post('/api/photo/rate', data);
  return response.data;
};

/**
 * Add photo to evaluated list
 * @param {Object} data - Photo data
 * @param {string} data.photoId - Photo ID
 * @returns {Promise<Object>} - Response with success message
 */
export const addPhotoToEvaluated = async (data) => {
  const response = await instance.post('/api/photo/evaluate/add', data);
  return response.data;
};

/**
 * Remove photo from evaluated list
 * @param {Object} data - Photo data
 * @param {string} data.photoId - Photo ID
 * @returns {Promise<Object>} - Response with success message
 */
export const removePhotoFromEvaluated = async (data) => {
  const response = await instance.post('/api/photo/evaluate/remove', data);
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
