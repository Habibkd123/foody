// utils/errorHandler.ts
export class APIError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'APIError';
  }
}

export const errorHandler = (error: any): { success: boolean; message: string; statusCode: number } => {
  if (error instanceof APIError) {
    return {
      success: false,
      message: error.message,
      statusCode: error.statusCode,
    };
  }

  // Mongoose validation errors
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map((err: any) => err.message);
    return {
      success: false,
      message: messages.join(', '),
      statusCode: 400,
    };
  }

  // MongoDB duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return {
      success: false,
      message: `${field} already exists`,
      statusCode: 400,
    };
  }

  return {
    success: false,
    message: 'Internal server error',
    statusCode: 500,
  };
};

