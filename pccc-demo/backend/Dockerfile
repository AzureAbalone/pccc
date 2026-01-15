# ================================
# PCCC Backend - Production Dockerfile
# ================================

# Stage 1: Build
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy workspace configuration
COPY package.json bun.lock ./
COPY shared/package.json ./shared/
COPY backend/package.json ./backend/

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY shared ./shared
COPY backend ./backend

# Build shared package first
WORKDIR /app/shared
RUN bun run build

# Build backend
WORKDIR /app/backend
RUN bun run build

# Stage 2: Production
FROM oven/bun:1-slim AS production

WORKDIR /app

# Copy built files
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/package.json ./
COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/shared/dist ./shared/dist
COPY --from=builder /app/shared/package.json ./shared/

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun --version || exit 1

# Start the application
CMD ["bun", "run", "dist/main.js"]
