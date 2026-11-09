# Production Dockerfile for MMUST DCBT Node.js Backend API
FROM node:20-alpine AS base

# Install dumb-init or dependencies if needed
RUN apk add --no-cache dumb-init wget

WORKDIR /usr/src/app

# Install dependencies based on package.json & lockfile
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy application source code
COPY . .

# Set proper environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Run as non-root user for security
USER node

# Expose API port
EXPOSE 5000

# Built-in liveness probe verifying process responsiveness
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health/live || exit 1

# Launch using dumb-init to handle PID 1 & signal forwarding properly
CMD ["dumb-init", "node", "server.js"]
