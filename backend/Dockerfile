# Use Node.js 18 Alpine as base image
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Development stage
FROM base AS development
RUN npm ci
COPY . .
EXPOSE 5000
CMD ["npm", "run", "dev"]

# Production stage - run directly from source (ES modules, no build needed)
# This avoids the ES module error by running from source instead of compiled dist
FROM node:18-alpine AS production

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source files (run directly without build since we're using ES modules)
COPY src ./src

# Create necessary directories
RUN mkdir -p logs uploads && chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 5000

# Health check - Render will use the healthCheckPath from render.yaml instead
# HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
#   CMD node -e "import('http').then(m=>m.get('http://localhost:5000/health',r=>process.exit(r.statusCode===200?0:1)))"

# Start application from source (ES modules)
CMD ["node", "src/index.js"]
