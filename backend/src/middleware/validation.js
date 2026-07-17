import { z } from 'zod';

// Validation schemas using Zod
export const validationSchemas = {
  createReview: z.object({
    body: z.object({
      weekNumber: z.number().int().min(1, 'Week must be at least 1').max(52, 'Week cannot exceed 52'),
      reviewerName: z.string().max(50, 'Reviewer name cannot exceed 50 characters').optional(),
      rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
      reviewText: z.string().min(10, 'Review must be at least 10 characters').max(2000, 'Review cannot exceed 2000 characters')
    })
  }),

  getReview: z.object({
    params: z.object({
      id: z.string().uuid('Invalid review ID format')
    })
  }),

  deleteReview: z.object({
    params: z.object({
      id: z.string().uuid('Invalid review ID format')
    })
  }),

  listReviews: z.object({
    query: z.object({
      week: z.string().regex(/^\d+$/, 'Week must be a number').optional(),
      page: z.string().regex(/^\d+$/, 'Page must be a number').optional(),
      limit: z.string().regex(/^\d+$/, 'Limit must be a number').optional(),
      sortBy: z.enum(['createdAt', 'rating', 'weekNumber']).optional(),
      sortOrder: z.enum(['asc', 'desc']).optional()
    })
  })
};

// Validation middleware factory
export const validate = (schema) => (req, res, next) => {
  try {
    const result = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params
    });
    req.validated = result;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }
    next(error);
  }
};

// Query parameter helpers
export const parseQueryInt = (value, defaultValue, min = 1, max = 100) => {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) return defaultValue;
  return Math.min(Math.max(parsed, min), max);
};

export const parseQueryString = (value, defaultValue = '') => {
  return value ? String(value).trim() : defaultValue;
};