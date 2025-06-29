/**
 * Global error handling utilities
 */

export interface ErrorInfo {
  message: string;
  code?: string;
  type: 'network' | 'auth' | 'validation' | 'storage' | 'unknown';
  retryable: boolean;
}

/**
 * Parse and categorize errors
 */
export const parseError = (error: any): ErrorInfo => {
  if (!error) {
    return {
      message: 'An unknown error occurred',
      type: 'unknown',
      retryable: false
    };
  }

  // Network errors
  if (error.message?.includes('ERR_BLOCKED_BY_CLIENT')) {
    return {
      message: 'Request blocked by browser extension or ad blocker',
      code: 'ERR_BLOCKED_BY_CLIENT',
      type: 'network',
      retryable: false
    };
  }

  if (error.message?.includes('ERR_NETWORK')) {
    return {
      message: 'Network connection error. Please check your internet connection.',
      code: 'ERR_NETWORK',
      type: 'network',
      retryable: true
    };
  }

  if (error.message?.includes('Failed to fetch')) {
    return {
      message: 'Unable to connect to server. Please try again.',
      code: 'FETCH_ERROR',
      type: 'network',
      retryable: true
    };
  }

  // Authentication errors
  if (error.message?.includes('Invalid login credentials')) {
    return {
      message: 'Invalid email or password',
      code: 'INVALID_CREDENTIALS',
      type: 'auth',
      retryable: false
    };
  }

  if (error.message?.includes('Email not confirmed')) {
    return {
      message: 'Please check your email and confirm your account',
      code: 'EMAIL_NOT_CONFIRMED',
      type: 'auth',
      retryable: false
    };
  }

  // Storage errors
  if (error.message?.includes('File too large')) {
    return {
      message: 'File is too large. Please choose a smaller file.',
      code: 'FILE_TOO_LARGE',
      type: 'storage',
      retryable: false
    };
  }

  // Validation errors
  if (error.message?.includes('required')) {
    return {
      message: error.message,
      code: 'VALIDATION_ERROR',
      type: 'validation',
      retryable: false
    };
  }

  // Default error
  return {
    message: error.message || 'An unexpected error occurred',
    code: error.code,
    type: 'unknown',
    retryable: true
  };
};

/**
 * Handle errors with appropriate user feedback
 */
export const handleError = (error: any, context?: string): ErrorInfo => {
  const errorInfo = parseError(error);
  
  // Log error for debugging
  console.error(`Error in ${context || 'unknown context'}:`, {
    error,
    errorInfo,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  });

  return errorInfo;
};

/**
 * Check if error is retryable
 */
export const isRetryableError = (error: any): boolean => {
  const errorInfo = parseError(error);
  return errorInfo.retryable;
};

/**
 * Get user-friendly error message
 */
export const getUserFriendlyMessage = (error: any): string => {
  const errorInfo = parseError(error);
  return errorInfo.message;
};

/**
 * Network status utilities
 */
export const getNetworkStatus = () => {
  return {
    online: navigator.onLine,
    connection: (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection,
    effectiveType: ((navigator as any).connection?.effectiveType) || 'unknown'
  };
};

/**
 * Retry with exponential backoff
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> => {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (!isRetryableError(error) || attempt === maxRetries - 1) {
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};