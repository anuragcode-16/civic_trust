/**
 * Database utility functions for safely accessing MongoDB data from client components
 * This approach avoids direct MongoDB client access from the browser
 */

import axios from 'axios';

// Track connection status to avoid multiple error messages
let connectionErrorShown = false;

/**
 * Check if the server is connected to the database
 * This helps client components know if they should show a connection error
 */
export async function checkDbConnection(): Promise<boolean> {
  try {
    const response = await axios.get('/api/health/db');
    return response.status === 200;
  } catch (error) {
    if (!connectionErrorShown) {
      console.error('Database connection error. Some features may be limited.');
      connectionErrorShown = true;
    }
    return false;
  }
}

/**
 * Reset connection error status (useful for retry flows)
 */
export function resetConnectionStatus() {
  connectionErrorShown = false;
}

/**
 * Fetch data through API routes instead of directly accessing MongoDB
 * @param endpoint API endpoint path (relative to /api)
 * @param params Optional query parameters
 */
export async function fetchData(endpoint: string, params: Record<string, any> = {}) {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `/api/${endpoint}${queryString ? `?${queryString}` : ''}`;
    
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    // Handle specific error types
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 401) {
        console.error('Authentication required');
        throw new Error('Authentication required to access this data');
      } else if (error.response.status === 404) {
        console.error(`Endpoint not found: ${endpoint}`);
        throw new Error('The requested resource was not found');
      }
    }
    
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Post data through API routes instead of directly accessing MongoDB
 * @param endpoint API endpoint path (relative to /api)
 * @param data Request body data
 */
export async function postData(endpoint: string, data: Record<string, any> = {}) {
  try {
    const url = `/api/${endpoint}`;
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    // Handle specific error types
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 401) {
        console.error('Authentication required');
        throw new Error('Authentication required to perform this action');
      }
    }
    
    console.error(`Error posting data to ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Update data through API routes
 * @param endpoint API endpoint path (relative to /api)
 * @param data Request body data
 */
export async function updateData(endpoint: string, data: Record<string, any> = {}) {
  try {
    const url = `/api/${endpoint}`;
    const response = await axios.put(url, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 401) {
        console.error('Authentication required');
        throw new Error('Authentication required to perform this action');
      } else if (error.response.status === 404) {
        console.error(`Resource not found: ${endpoint}`);
        throw new Error('The resource you are trying to update was not found');
      }
    }
    
    console.error(`Error updating data at ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Delete data through API routes
 * @param endpoint API endpoint path (relative to /api)
 * @param params Optional query parameters
 */
export async function deleteData(endpoint: string, params: Record<string, any> = {}) {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `/api/${endpoint}${queryString ? `?${queryString}` : ''}`;
    
    const response = await axios.delete(url);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 401) {
        console.error('Authentication required');
        throw new Error('Authentication required to perform this action');
      } else if (error.response.status === 404) {
        console.error(`Resource not found: ${endpoint}`);
        throw new Error('The resource you are trying to delete was not found');
      }
    }
    
    console.error(`Error deleting data from ${endpoint}:`, error);
    throw error;
  }
} 