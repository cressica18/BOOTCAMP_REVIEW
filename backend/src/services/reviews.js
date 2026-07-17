import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundError, ValidationError } from '../middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data file path - can be overridden via environment variable
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'reviews.json');

/**
 * Ensure data directory and file exist
 */
async function ensureDataFile() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }

  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

/**
 * Read all reviews from JSON file
 */
async function readReviews() {
  await ensureDataFile();
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading reviews:', error);
    return [];
  }
}

/**
 * Write reviews to JSON file
 */
async function writeReviews(reviews) {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(reviews, null, 2), 'utf-8');
}

/**
 * Validate review data
 */
function validateReview(data) {
  const errors = [];

  if (!data.weekNumber || !Number.isInteger(Number(data.weekNumber)) || Number(data.weekNumber) < 1) {
    errors.push({ field: 'weekNumber', message: 'Week number is required and must be a positive integer' });
  }

  if (!data.reviewerName || typeof data.reviewerName !== 'string') {
    errors.push({ field: 'reviewerName', message: 'Reviewer name is required' });
  }

  const rating = Number(data.rating);
  if (!data.rating || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    errors.push({ field: 'rating', message: 'Rating is required and must be an integer between 1 and 5' });
  }

  if (!data.reviewText || typeof data.reviewText !== 'string' || data.reviewText.trim().length === 0) {
    errors.push({ field: 'reviewText', message: 'Review text is required' });
  }

  if (data.reviewText && data.reviewText.length > 5000) {
    errors.push({ field: 'reviewText', message: 'Review text must be 5000 characters or less' });
  }

  if (errors.length > 0) {
    throw new ValidationError('Validation failed', errors);
  }
}

/**
 * Create a new review
 */
export async function createReview(data) {
  validateReview(data);

  const reviews = await readReviews();

  const newReview = {
    id: uuidv4(),
    weekNumber: Number(data.weekNumber),
    reviewerName: data.reviewerName.trim(),
    rating: Number(data.rating),
    reviewText: data.reviewText.trim(),
    createdAt: new Date().toISOString()
  };

  reviews.unshift(newReview); // Add to beginning (newest first)
  await writeReviews(reviews);

  return newReview;
}

/**
 * Get all reviews, optionally filtered by week
 * Accepts either a week number or a query object with week property
 */
export async function getReviews(query = {}) {
  const reviews = await readReviews();

  // Extract week from query object if passed
  const weekNumber = query.week;

  if (weekNumber !== null && weekNumber !== undefined && weekNumber !== '') {
    const week = Number(weekNumber);
    if (!Number.isInteger(week) || week < 1) {
      throw new ValidationError('Week number must be a positive integer');
    }
    return reviews.filter(r => r.weekNumber === week);
  }

  return reviews;
}

/**
 * Get a single review by ID
 */
export async function getReviewById(id) {
  const reviews = await readReviews();
  const review = reviews.find(r => r.id === id);

  if (!review) {
    throw new NotFoundError('Review not found');
  }

  return review;
}

/**
 * Delete a review by ID
 */
export async function deleteReview(id) {
  const reviews = await readReviews();
  const index = reviews.findIndex(r => r.id === id);

  if (index === -1) {
    throw new NotFoundError('Review not found');
  }

  const deleted = reviews.splice(index, 1)[0];
  await writeReviews(reviews);

  return deleted;
}

/**
 * Get all unique week numbers that have reviews
 */
export async function getWeekNumbers() {
  const reviews = await readReviews();
  const weeks = [...new Set(reviews.map(r => r.weekNumber))].sort((a, b) => a - b);
  return weeks;
}

/**
 * Get review statistics
 */
export async function getStats() {
  const reviews = await readReviews();

  if (reviews.length === 0) {
    return {
      totalReviews: 0,
      averageRating: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      weeksCovered: 0
    };
  }

  const totalReviews = reviews.length;
  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach(r => ratingDistribution[r.rating]++);
  const weeksCovered = new Set(reviews.map(r => r.weekNumber)).size;

  return {
    totalReviews,
    averageRating: Math.round(averageRating * 10) / 10,
    ratingDistribution,
    weeksCovered
  };
}

/**
 * Review store object for easier importing
 */
export const reviewStore = {
  create: createReview,
  findAll: getReviews,
  findById: getReviewById,
  deleteById: deleteReview,
  getWeekNumbers,
  getStats
};