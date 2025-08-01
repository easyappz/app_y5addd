import { instance } from './axios';

/**
 * Check if the user is authenticated by validating the token
 * @returns {Promise<boolean>} - Returns true if authenticated, false otherwise
 */
export const checkAuth = async () => {
  try {
    const response = await instance.get('/api/auth/check');
    return response.status === 200 && response.data.isAuthenticated === true;
  } catch (error) {
    console.error('Authentication check failed:', error);
    return false;
  }
};

/**
 * Login a user with email and password
 * @param {string} email - The email address of the user
 * @param {string} password - The password of the user
 * @returns {Promise<Object>} - Response from the server containing the token
 */
export const login = async (email, password) => {
  try {
    const response = await instance.post('/api/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error.response?.data || error;
  }
};

/**
 * Register a new user with email and password
 * @param {string} email - The email address of the user
 * @param {string} password - The password of the user
 * @returns {Promise<Object>} - Response from the server containing the token
 */
export const register = async (email, password) => {
  try {
    const response = await instance.post('/api/register', { email, password });
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error.response?.data || error;
  }
};

/**
 * Request a password reset for the given email
 * @param {string} email - The email address of the user
 * @returns {Promise<Object>} - Response from the server
 */
export const forgotPassword = async (email) => {
  try {
    const response = await instance.post('/api/forgot-password', { email });
    return response.data;
  } catch (error) {
    console.error('Forgot password request failed:', error);
    throw error.response?.data || error;
  }
};

/**
 * Reset user password with a token and new password
 * @param {string} token - The reset token received via email
 * @param {string} newPassword - The new password to set
 * @returns {Promise<Object>} - Response from the server
 */
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await instance.post('/api/reset-password', { token, newPassword });
    return response.data;
  } catch (error) {
    console.error('Password reset failed:', error);
    throw error.response?.data || error;
  }
};

/**
 * Logout the current user
 * @returns {Promise<Object>} - Response from the server
 */
export const logout = async () => {
  try {
    const response = await instance.post('/api/logout');
    localStorage.removeItem('token');
    return response.data;
  } catch (error) {
    console.error('Logout failed:', error);
    localStorage.removeItem('token');
    throw error.response?.data || error;
  }
};
