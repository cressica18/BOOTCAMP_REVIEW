import express from 'express';
import { reviewStore } from '../services/reviews.js';
import { validate, validationSchemas } from '../middleware/validation.js';
import { asyncHandler, NotFoundError } from '../middleware/errorHandler.js';

const router = express.Router();

// GET /api/reviews - List all reviews with optional week filtering
router.get('/', validate(validationSchemas.listReviews), asyncHandler(async (req, res) => {
  const reviews = await reviewStore.findAll(req.validated.query);
  res.json({
    success: true,
    data: reviews
  });
}));

// GET /api/reviews/stats - Get review statistics
router.get('/stats', asyncHandler(async (_req, res) => {
  const stats = await reviewStore.getStats();
  res.json({
    success: true,
    data: stats
  });
}));

// GET /api/reviews/weeks - Get unique week numbers
router.get('/weeks', asyncHandler(async (_req, res) => {
  const weeks = await reviewStore.getWeekNumbers();
  res.json({
    success: true,
    data: weeks
  });
}));

// GET /api/reviews/:id - Get single review by ID
router.get('/:id', validate(validationSchemas.getReview), asyncHandler(async (req, res) => {
  const review = await reviewStore.findById(req.validated.params.id);
  if (!review) {
    throw new NotFoundError('Review not found');
  }
  res.json({
    success: true,
    data: review
  });
}));

// POST /api/reviews - Create new review
router.post('/', validate(validationSchemas.createReview), asyncHandler(async (req, res) => {
  const review = await reviewStore.create(req.validated.body);
  res.status(201).json({
    success: true,
    data: review,
    message: 'Review created successfully'
  });
}));

// DELETE /api/reviews/:id - Delete review by ID
router.delete('/:id', validate(validationSchemas.deleteReview), asyncHandler(async (req, res) => {
  const deleted = await reviewStore.deleteById(req.validated.params.id);
  if (!deleted) {
    throw new NotFoundError('Review not found');
  }
  res.json({
    success: true,
    message: 'Review deleted successfully'
  });
}));

export default router;