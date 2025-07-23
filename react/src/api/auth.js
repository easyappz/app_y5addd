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
