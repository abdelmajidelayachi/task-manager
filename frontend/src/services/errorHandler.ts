export interface AppError {
  message: string;
  code?: string;
  status?: number;
  timestamp: Date;
}

export class ErrorHandler {
  static handle(error: unknown, context?: string): AppError {
    const timestamp = new Date();

    if (error instanceof Error) {
      console.error(`Error in ${context || 'unknown context'}:`, error);
      return {
        message: error.message,
        timestamp,
      };
    }

    if (typeof error === 'string') {
      console.error(`Error in ${context || 'unknown context'}:`, error);
      return {
        message: error,
        timestamp,
      };
    }

    // Handle axios errors specifically
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as any;
      console.error(`API Error in ${context || 'unknown context'}:`, axiosError);
      return {
        message: axiosError.response?.data?.message || axiosError.message || 'API request failed',
        code: axiosError.code,
        status: axiosError.response?.status,
        timestamp,
      };
    }

    console.error(`Unknown error in ${context || 'unknown context'}:`, error);
    return {
      message: 'An unexpected error occurred',
      timestamp,
    };
  }

  static async withErrorHandling<T>(
    operation: () => Promise<T> | T,
    context?: string
  ): Promise<T | null> {
    try {
      const result = await operation();
      return result;
    } catch (error) {
      const appError = this.handle(error, context);
      this.logError(appError, context);
      // Return null instead of throwing to allow graceful error handling
      return null;
    }
  }

  static logError(error: AppError, context?: string): void {
    console.error(`[${error.timestamp.toISOString()}] Error in ${context}:`, {
      message: error.message,
      code: error.code,
      status: error.status,
    });
  }

  static isNetworkError(error: unknown): boolean {
    // Check for various network error types
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return true;
    }

    // Check for axios network errors
    if (error && typeof error === 'object' && 'code' in error) {
      const axiosError = error as any;
      return axiosError.code === 'NETWORK_ERROR' ||
        axiosError.code === 'ECONNREFUSED' ||
        axiosError.code === 'TIMEOUT';
    }

    return false;
  }

  static isValidationError(error: unknown): boolean {
    if (error instanceof Error && error.message.includes('validation')) {
      return true;
    }

    // Check for axios validation errors (typically 400 status)
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as any;
      return axiosError.response?.status === 400;
    }

    return false;
  }

  // Additional helper methods for common error scenarios
  static isAuthError(error: unknown): boolean {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as any;
      return axiosError.response?.status === 401 || axiosError.response?.status === 403;
    }
    return false;
  }

  static isNotFoundError(error: unknown): boolean {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as any;
      return axiosError.response?.status === 404;
    }
    return false;
  }

  static isServerError(error: unknown): boolean {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as any;
      const status = axiosError.response?.status;
      return status >= 500 && status < 600;
    }
    return false;
  }
}

// Export the main function with better typing
export const handleAsync = <T>(
  operation: () => Promise<T> | T,
  context?: string
): Promise<T | null> => {
  return ErrorHandler.withErrorHandling(operation, context);
};
