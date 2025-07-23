import { instance } from './axios';

// Upload a photo
export const uploadPhoto = async (formData) => {
  const response = await instance.post('/api/photo/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Get photos to rate
export const getPhotosToRate = async () => {
  const response = await instance.get('/api/photo/rate');
  return response.data;
};

// Rate a photo
export const ratePhoto = async (photoId, score) => {
  const response = await instance.post('/api/photo/rate', { photoId, score });
  return response.data;
};

// Add photo to evaluated list
export const addPhotoToEvaluated = async (photoId) => {
  const response = await instance.post('/api/photo/evaluate/add', { photoId });
  return response.data;
};

// Remove photo from evaluated list
export const removePhotoFromEvaluated = async (photoId) => {
  const response = await instance.post('/api/photo/evaluate/remove', { photoId });
  return response.data;
};

// Get photo statistics
export const getPhotoStatistics = async (photoId) => {
  const response = await instance.get(`/api/photo/statistics/${photoId}`);
  return response.data;
};
