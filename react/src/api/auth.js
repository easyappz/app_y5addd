import { instance } from './axios';

export const register = async (email, password) => {
  try {
    const response = await instance.post('/api/register', { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const login = async (email, password) => {
  try {
    const response = await instance.post('/api/login', { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await instance.post('/api/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await instance.post('/api/reset-password', { token, newPassword });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};