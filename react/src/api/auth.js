import { instance } from './axios';

/**
 * Check if the user is authenticated by validating the token
 * @returns {Promise<boolean>} - Returns true if authenticated, false otherwise
 */
export const checkAuth = async () => {
  try {
    // Assuming there is an endpoint to validate the token
    const response = await instance.get('/api/auth/check');
    return response.data.isAuthenticated || false;
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
