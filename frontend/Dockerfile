# Multi-stage Dockerfile for Frontend
# Stage 1: Build the Vite application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for layer caching
COPY package*.json ./

# Install all dependencies (including dev) for building
RUN npm install --no-audit --no-fund

# Copy source code
COPY . .

# Build the application
# VITE_API_URL is embedded at build time via --build-arg
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL:-http://localhost:5000}

RUN npm run build

# Stage 2: Serve static files with nginx
FROM nginx:alpine

# Remove default nginx config
RUN rm -rf /usr/share/nginx/html/*

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the nginx HTTP port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]