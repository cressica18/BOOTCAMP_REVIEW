import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundError, ValidationError } from '../middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data file path (in data directory for persistence)
const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'reviews.json');

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Load reviews from file
function loadReviews() {
  ensureDataDir();
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error loading reviews:', error);
    return [];
  }
}

// Save reviews to file
function saveReviews(reviews) {
  ensureDataDir();
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(reviews, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving reviews:', error);
    throw new Error('Failed to save reviews');
  }
}

// Review model functions
export const reviewStore = {
  // Get all reviews with optional filtering, sorting, and pagination
  findAll(filters = {}) {
    let reviews = loadReviews();

    // Apply filters
    if (filters.bootcampName) {
      const search = filters.bootcampName.toLowerCase();
      reviews = reviews.filter(r =>
        r.bootcampName.toLowerCase().includes(search)
      );
    }
    if (filters.minRating !== undefined) {
      reviews = reviews.filter(r => r.rating >= filters.minRating);
    }
    if (filters.maxRating !== undefined) {
      reviews = reviews.filter(r => r.rating <= filters.maxRating);
    }
    if (filters.wouldRecommend !== undefined) {
      reviews = reviews.filter(r => r.wouldRecommend === filters.wouldRecommend);
    }

    // Apply sorting
    const sortBy = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder || 'desc';
    reviews.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      reviews: reviews.slice(start, end),
      pagination: {
        page,
        limit,
        total: reviews.length,
        totalPages: Math.ceil(reviews.length / limit)
      }
    };
  },

  // Get single review by ID
  findById(id) {
    const reviews = loadReviews();
    return reviews.find(r => r.id === id) || null;
  },

  // Create new review
  create(data) {
    const reviews = loadReviews();
    const newReview = {
      id: uuidv4(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    reviews.push(newReview);
    saveReviews(reviews);
    return newReview;
  },

  // Delete review by ID
  deleteById(id) {
    const reviews = loadReviews();
    const index = reviews.findIndex(r => r.id === id);
    if (index === -1) {
      return false;
    }
    reviews.splice(index, 1);
    saveReviews(reviews);
    return true;
  },

  // Get all unique bootcamp names
  getBootcampNames() {
    const reviews = loadReviews();
    const names = [...new Set(reviews.map(r => r.bootcampName))];
    return names.sort();
  },

  // Get statistics
  getStats() {
    const reviews = loadReviews();
    if (reviews.length === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        recommendPercentage: 0,
        bootcampCount: 0
      };
    }
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const recommendCount = reviews.filter(r => r.wouldRecommend).length;
    return {
      totalReviews: reviews.length,
      averageRating: Math.round((totalRating / reviews.length) * 10) / 10,
      recommendPercentage: Math.round((recommendCount / reviews.length) * 100),
      bootcampCount: new Set(reviews.map(r => r.bootcampName)).size
    };
  }
};

export default reviewStore;