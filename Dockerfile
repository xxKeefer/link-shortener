# Use Node 23 official image
FROM node:23 AS base

# Enable corepack (manages pnpm automatically)
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace config and lockfile first for dependency install caching
COPY pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./

# Copy root package.json (optional but recommended)
COPY package.json ./

# Copy backend and frontend package.json files for install optimization
COPY backend/package.json backend/
# COPY frontend/package.json frontend/

# Install dependencies with pnpm in workspace mode
RUN pnpm install

# -------------- Build stage --------------
FROM base AS builder

# Copy all source code for backend and frontend
COPY backend ./backend
COPY frontend ./frontend

# Run the turbo build (assumes you have "build" script in turbo.json or package.json)
RUN pnpm turbo run build --filter=backend

# -------------- Production stage --------------
FROM node:23-alpine AS production

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy only the built backend dist and necessary files
COPY --from=builder /app/backend/dist ./backend/dist
COPY backend/package.json ./backend/
COPY pnpm-lock.yaml ./

# Install only production dependencies for backend
RUN pnpm install --prod --filter backend...

# Expose your backend port (adjust if needed)
EXPOSE 3000

# Start the backend app from the built JS files
CMD ["node", "backend/dist/src/main.js"]
