// API Client with token interceptor
import axios, { type AxiosInstance, type AxiosResponse, AxiosError } from 'axios';
import { authService } from './authService';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string = 'http://localhost:8088/api') { // Updated default base URL
    this.axiosInstance = axios.create({
      baseURL: baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // Request timeout
    });

    // Request interceptor to add Authorization header
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = authService.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle global errors like 401 Unauthorized
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        // If the error is an AxiosError and has a response
        if (error.response) {
          // Handle 401 Unauthorized specifically
          if (error.response.status === 401) {
            authService.clearToken(); // Clear invalid token
            // Redirect to login page. Using window.location.href to ensure full page reload for auth state reset.
            window.location.href = '/login';
            // Throw a specific error to stop further processing in the caller
            return Promise.reject(new Error('Unauthorized. Please login again.'));
          }

          // Centralized error handling for other HTTP errors
          const errorData = error.response.data as { message?: string };
          return Promise.reject(
            new Error(errorData.message || `API error! status: ${error.response.status}`)
          );
        } else if (error.request) {
          // The request was made but no response was received (e.g., network error)
          return Promise.reject(new Error('Network Error: No response received from server.'));
        } else {
          // Something happened in setting up the request that triggered an Error
          return Promise.reject(new Error(`Request Error: ${error.message}`));
        }
      }
    );
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response: AxiosResponse<T> = await this.axiosInstance.get(endpoint);
    return { data: response.data, success: true };
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    const response: AxiosResponse<T> = await this.axiosInstance.post(endpoint, data);
    return { data: response.data, success: true };
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    const response: AxiosResponse<T> = await this.axiosInstance.put(endpoint, data);
    return { data: response.data, success: true };
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response: AxiosResponse<T> = await this.axiosInstance.delete(endpoint);
    return { data: response.data, success: true };
  }

  async patch<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    const response: AxiosResponse<T> = await this.axiosInstance.patch(endpoint, data);
    return { data: response.data, success: true };
  }
}

export const apiClient = new ApiClient();
