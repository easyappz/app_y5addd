import { instance } from './axios';

/**
 * Register a new user
 * @param {Object} data - User registration data
 * @param {string} data.email - User email
 * @param {string} data.password - User password
 * @returns {Promise<Object>} - Response with token
 */
export const register = async (data) => {
  const response = await instance.post('/api/register', data);
  return response.data;
};

/**
 * Login a user
 * @param {Object} data - User login data
 * @param {string} data.email - User email
 * @param {string} data.password - User password
 * @returns {Promise<Object>} - Response with token
 */
export const login = async (data) => {
  const response = await instance.post('/api/login', data);
  return response.data;
};

/**
 * Request password reset
 * @param {Object} data - User email data
 * @param {string} data.email - User email
 * @returns {Promise<Object>} - Response with message and token
 */
export const forgotPassword = async (data) => {
  const response = await instance.post('/api/forgot-password', data);
  return response.data;
};

/**
 * Reset user password
 * @param {Object} data - Reset password data
 * @param {string} data.token - Reset token
 * @param {string} data.newPassword - New password
 * @returns {Promise<Object>} - Response with success message
 */
export const resetPassword = async (data) => {
  const response = await instance.post('/api/reset-password', data);
  return response.data;
};
