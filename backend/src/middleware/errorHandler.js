// Custom error classes
export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_SERVER_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', details = []) {
    super(message, 400, 'VALIDATION_ERROR');
    this.details = details;
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 409, 'CONFLICT');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
  }
}

/**
 * Async error wrapper to catch errors in async route handlers
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Global error handler middleware
 */
export function errorHandler(err, _req, res, _next) {
  // Log error for debugging (in production, use a proper logger)
  if (process.env.NODE_ENV !== 'production') {
    console.error('Error:', err);
  }

  // Default error values
  let statusCode = err.statusCode || 500;
  let code = err.code || 'INTERNAL_SERVER_ERROR';
  let message = err.message || 'An unexpected error occurred';
  let details = err.details || null;

  // Handle specific error types
  if (err instanceof ValidationError) {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = 'Validation failed';
  } else if (err.name === 'ValidationError') {
    // Handle express-validator or similar validation errors
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = 'Validation failed';
    details = err.errors || err.details;
  } else if (err.name === 'SyntaxError' && err.status === 400 && 'body' in err) {
    // Handle JSON parsing errors
    statusCode = 400;
    code = 'INVALID_JSON';
    message = 'Invalid JSON in request body';
  } else if (err.code === 'ENOENT') {
    // File not found errors
    statusCode = 404;
    code = 'NOT_FOUND';
    message = 'Resource not found';
  }

  // Handle operational errors (known errors we can handle)
  if (err.isOperational) {
    return res.status(statusCode).json({
      success: false,
      error: {
        code,
        message,
        ...(details && { details })
      }
    });
  }

  // Programming errors (bugs) - don't leak details in production
  if (process.env.NODE_ENV === 'production') {
    message = 'An unexpected error occurred';
    details = null;
  }

  // Log programming errors for debugging
  console.error('PROGRAMMING ERROR:', err);

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message,
      ...(details && { details })
    }
  });
}

/**
 * 404 Not Found handler for unmatched routes
 */
export function notFoundHandler(req, _res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  error.code = 'ROUTE_NOT_FOUND';
  error.isOperational = true;
  next(error);
}