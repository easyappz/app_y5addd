import { instance } from './axios';

export const uploadPhoto = async (photo) => {
  try {
    const formData = new FormData();
    formData.append('photo', photo);
    const response = await instance.post('/api/photo/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getPhotosToRate = async () => {
  try {
    const response = await instance.get('/api/photo/rate');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const ratePhoto = async (photoId, score) => {
  try {
    const response = await instance.post('/api/photo/rate', { photoId, score });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const addPhotoToEvaluated = async (photoId) => {
  try {
    const response = await instance.post('/api/photo/evaluate/add', { photoId });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const removePhotoFromEvaluated = async (photoId) => {
  try {
    const response = await instance.post('/api/photo/evaluate/remove', { photoId });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getPhotoStatistics = async (photoId) => {
  try {
    const response = await instance.get(`/api/photo/statistics/${photoId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};