import { z } from 'zod';

// Review validation schema
export const reviewSchema = z.object({
  bootcampName: z.string()
    .min(1, 'Bootcamp name is required')
    .max(100, 'Bootcamp name must be 100 characters or less')
    .trim(),
  reviewerName: z.string()
    .min(1, 'Reviewer name is required')
    .max(50, 'Reviewer name must be 50 characters or less')
    .trim(),
  rating: z.number()
    .int('Rating must be an integer')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
  reviewText: z.string()
    .min(10, 'Review must be at least 10 characters')
    .max(2000, 'Review must be 2000 characters or less')
    .trim(),
  wouldRecommend: z.boolean()
});

// Review ID param validation
export const reviewIdParamSchema = z.object({
  id: z.string().uuid('Invalid review ID format')
});

// Query validation for listing reviews
export const reviewQuerySchema = z.object({
  bootcampName: z.string().max(100).trim().optional(),
  minRating: z.coerce.number().int().min(1).max(5).optional(),
  maxRating: z.coerce.number().int().min(1).max(5).optional(),
  wouldRecommend: z.coerce.boolean().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  sortBy: z.enum(['createdAt', 'rating', 'bootcampName']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

// Validation middleware factory
export function validate(schema) {
  return (req, _res, next) => {
    try {
      // Validate body, params, and query
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }
      if (schema.params) {
        req.params = schema.params.parse(req.params);
      }
      if (schema.query) {
        req.query = schema.query.parse(req.query);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}

// Validation schemas for each route
export const validationSchemas = {
  createReview: {
    body: reviewSchema
  },
  getReview: {
    params: reviewIdParamSchema
  },
  deleteReview: {
    params: reviewIdParamSchema
  },
  listReviews: {
    query: reviewQuerySchema
  }
};