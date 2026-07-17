import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import reviewsRouter from './routes/reviews.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// Trust proxy for proper IP handling behind reverse proxies
app.set('trust proxy', 1);

// Middleware
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Request logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
    next();
  });
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/reviews', reviewsRouter);

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    success: true,
    name: 'Bootcamp Review API',
    version: '1.0.0',
    documentation: '/api/health'
  });
});

// 404 handler for unmatched routes
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║  Bootcamp Review API Server                                 ║
║  ─────────────────────────────────────────────────────────  ║
║  Environment: ${(process.env.NODE_ENV || 'development').padEnd(45)} ║
║  Port: ${String(PORT).padEnd(52)} ║
║  CORS Origin: ${(CORS_ORIGIN || '*').padEnd(45)} ║
║  Health Check: http://localhost:${PORT}/api/health            ║
╚══════════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log('Server closed. Goodbye!');
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export default app;