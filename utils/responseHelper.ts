// utils/responseHelper.ts
export const createSuccessResponse = <T>(data: T, message = 'Success'): SuccessResponse<T> => {
  return {
    success: true,
    data,
    message,
  };
};

export const createErrorResponse = (message: string, statusCode = 400): ErrorResponse => {
  return {
    success: false,
    message,
    statusCode,
  };
};

// Validation helper
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password && password.length >= 6 || false;
};

export type SuccessResponse<T> = {
  success: true;
  data: T;
  message: string;
};

export type ErrorResponse = {
  success: false;
  message: string;
  statusCode: number;
};

