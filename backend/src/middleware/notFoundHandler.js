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