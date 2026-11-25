
# ==================================
# Stage 1: Build Stage
# ==================================
FROM node:22-alpine AS build

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy application source code
COPY . .

# Remove development dependencies
RUN npm prune --omit=dev


# ==================================
# Stage 2: Production Stage
# ==================================
FROM node:22-alpine AS production

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy package files
COPY --from=build --chown=node:node /app/package*.json ./

# Copy production dependencies
COPY --from=build --chown=node:node /app/node_modules ./node_modules

# Copy application source
COPY --from=build --chown=node:node /app/src ./src
COPY --from=build --chown=node:node /app/app.js ./app.js

# Run as non-root user
USER node

# Application port
EXPOSE 3000

# Start application
CMD ["node", "app.js"]
