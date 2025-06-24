import axios from 'axios'; // Import axios
import type { LoginRequest, RegisterRequest, AuthResponse, User, SuccessResponse } from '../types/auth';

const TOKEN_KEY = 'accessToken'; // Key for storing the access token in local storage

class AuthService {
  private API_BASE_URL = 'http://localhost:8088/auth'; // Base URL for your Spring Boot authentication API

  /**
   * Handles user login by sending credentials to the backend.
   * @param credentials LoginRequest containing username and password.
   * @returns A promise that resolves with an object containing the User and accessToken.
   * @throws Error if authentication fails (e.g., invalid credentials, network error).
   */
  async login(credentials: LoginRequest): Promise<{ user: User; token: string }> {
    try {
      const response = await axios.post<AuthResponse>(`${this.API_BASE_URL}/login`, credentials);

      this.setToken(response.data.accessToken); // Store the received access token

      // Extract username from token for the User object needed by AuthContext
      const username = this.extractUsernameFromToken(response.data.accessToken) || credentials.username;
      const user: User = { username: username }; // Create a basic user object

      return {
        user: user,
        token: response.data.accessToken,
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Authentication failed.');
      }
      console.error('Login failed:', error);
      throw error; // Re-throw to be handled by the calling component
    }
  }

  /**
   * Handles user registration by sending user data to the backend.
   * @returns A promise that resolves with a SuccessResponse from the backend.
   * @throws Error if registration fails (e.g., username already exists, network error).
   */
  async register(userData: RegisterRequest): Promise<SuccessResponse> {
    try {
      const response = await axios.post<SuccessResponse>(`${this.API_BASE_URL}/register`, userData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Registration failed.');
      }
      console.error('Registration failed:', error);
      throw error; // Re-throw to be handled by the calling component
    }
  }

  /**
   * Retrieves the current user's details based on the stored token.
   * @returns A promise that resolves with a User object.
   * @throws Error if no token is found or user details cannot be retrieved.
   */
  async getCurrentUser(): Promise<User> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No authentication token found. User is not logged in.');
    }

    try {
      const username = this.extractUsernameFromToken(token);
      if (!username) {
        throw new Error('Could not extract username from token.');
      }
      return { username: username };
    } catch (error) {
      console.error('Failed to get current user:', error);
      throw error;
    }
  }

  /**
   * Stores the JWT in local storage.
   * @param token The JWT string to store.
   */
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  /**
   * Retrieves the JWT from local storage.
   * @returns The JWT string or null if not found.
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Clears the JWT from local storage, effectively logging out the user.
   */
  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  /**
   * Basic attempt to extract username from JWT payload.
   * @param token The JWT string.
   * @returns The extracted username (subject 'sub' claim) or null if not found/invalid.
   */
  private extractUsernameFromToken(token: string): string | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }
      const decodedPayload = atob(parts[1]); // Decode base64
      const payload = JSON.parse(decodedPayload);
      return payload.sub || null; // 'sub' is the standard claim for subject (username)
    } catch (e) {
      console.error('Failed to decode token payload:', e);
      return null;
    }
  }
}

// Export an instance of the service for easy use throughout your application
export const authService = new AuthService();
