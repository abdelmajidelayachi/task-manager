/**
 * Interface for user login request.
 * Corresponds to AuthRequest.java
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * Interface for user registration request.
 * Corresponds to RegisterRequest.java (assuming it has username, password, and name)
 */
export interface RegisterRequest {
  username: string;
  password: string;
  name: string; // Optional, based on common registration fields
}

/**
 * Interface for authentication response.
 * Corresponds to AuthResponse.java
 */
export interface AuthResponse {
  accessToken: string;
}

/**
 * Interface for a User object.
 * This is a simplified representation based on common needs.
 * Full details would come from a dedicated /user/me or similar endpoint.
 */
export interface User {
  username: string;
  id?: string;
  name?: string;
  authorities?: string[];
  // Do NOT include password here
}

/**
 * Interface for a generic success response.
 * Corresponds to SuccessResponse.java
 */
export interface SuccessResponse {
  message: string;
  timestamp: string; // ISO 8601 string for LocalDateTime from Java
  status: boolean;
}
