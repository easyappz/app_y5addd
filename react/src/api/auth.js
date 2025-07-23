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
