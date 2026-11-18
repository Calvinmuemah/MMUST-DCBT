# Production Dockerfile for MMUST DCBT Node.js Backend API (PM2 Cluster Mode)
FROM node:20-alpine AS base

# Install dumb-init and wget for health checks
RUN apk add --no-cache dumb-init wget

WORKDIR /usr/src/app

# Install dependencies based on package.json & lockfile
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Setup PM2 runtime directories with proper permissions for node user
ENV PM2_HOME=/home/node/.pm2
RUN mkdir -p /home/node/.pm2 && chown -R node:node /home/node/.pm2

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

# Launch using pm2-runtime in cluster mode across all CPU cores
CMD ["./node_modules/.bin/pm2-runtime", "start", "ecosystem.config.cjs"]
