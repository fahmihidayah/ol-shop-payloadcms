# Multi-stage Docker build for Next.js + PayloadCMS Application
# This Dockerfile creates an optimized production build

# Stage 1: Base image with Node.js
FROM node:22.12.0-alpine AS base

# Install dependencies needed for native modules and sharp
RUN apk add --no-cache \
    libc6-compat \
    dumb-init \
    wget \
    && rm -rf /var/cache/apk/*

# Install pnpm directly (bypass corepack signature issues)
RUN npm install -g pnpm@latest

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Stage 2: Install dependencies
FROM base AS deps

# Install dependencies with pnpm
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
ENV CI=true
RUN pnpm install --frozen-lockfile --production=false

# Stage 3: Build the application
FROM base AS builder

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Set build environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--no-deprecation"

# PayloadCMS requires PAYLOAD_SECRET for build process

# Build arguments for environment variables
ARG DATABASE_URL
ARG DATABASE_PUBLIC_URL
ARG PAYLOAD_SECRET
ARG DATABASE_AUTH_TOKEN
ARG DUITKU_MERCHANT_CODE
ARG DUITKU_API_KEY
ARG DUITKU_ENVIRONMENT
ARG DUITKU_CALLBACK_URL
ARG DUITKU_RETURN_URL
ARG DUITKU_EXPIRY_PERIOD
ARG NEXT_PUBLIC_BASE_URL
ARG CLOUD_STORAGE_BUCKET
ARG CLOUD_STORAGE_ENDPOINT
ARG CLOUD_STORAGE_ACCESS_KEY
ARG CLOUD_STORAGE_SECRET

# Set environment variables from build arguments
ENV DATABASE_PUBLIC_URL=$DATABASE_PUBLIC_URL
ENV DATABASE_URL=$DATABASE_PUBLIC_URL
ENV PAYLOAD_SECRET=$PAYLOAD_SECRET
ENV DATABASE_AUTH_TOKEN=$DATABASE_AUTH_TOKEN
ENV DUITKU_MERCHANT_CODE=$DUITKU_MERCHANT_CODE
ENV DUITKU_API_KEY=$DUITKU_API_KEY
ENV DUITKU_ENVIRONMENT=$DUITKU_ENVIRONMENT
ENV DUITKU_CALLBACK_URL=$DUITKU_CALLBACK_URL
ENV DUITKU_RETURN_URL=$DUITKU_RETURN_URL
ENV DUITKU_EXPIRY_PERIOD=$DUITKU_EXPIRY_PERIOD
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV CLOUD_STORAGE_BUCKET=$CLOUD_STORAGE_BUCKET
ENV CLOUD_STORAGE_ENDPOINT=$CLOUD_STORAGE_ENDPOINT
ENV CLOUD_STORAGE_ACCESS_KEY=$CLOUD_STORAGE_ACCESS_KEY
ENV CLOUD_STORAGE_SECRET=$CLOUD_STORAGE_SECRET


# Generate Payload types and importmap (optional - continue if fails)
RUN pnpm run generate:types || echo "Types generation skipped"
RUN pnpm run generate:importmap || echo "Importmap generation skipped"

# Build the application
RUN pnpm run build

# Stage 4: Production runtime
FROM base AS runner

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--no-deprecation"

# Default environment variables (override these when running the container)

# Build arguments for runtime environment variables
ARG DATABASE_URL
ARG PAYLOAD_SECRET
ARG DATABASE_AUTH_TOKEN
ARG DUITKU_MERCHANT_CODE
ARG DUITKU_API_KEY
ARG DUITKU_ENVIRONMENT
ARG DUITKU_CALLBACK_URL
ARG DUITKU_RETURN_URL
ARG DUITKU_EXPIRY_PERIOD
ARG NEXT_PUBLIC_BASE_URL
ARG CLOUD_STORAGE_BUCKET
ARG CLOUD_STORAGE_ENDPOINT
ARG CLOUD_STORAGE_ACCESS_KEY
ARG CLOUD_STORAGE_SECRET

# Set environment variables from build arguments
ENV DATABASE_URL=$DATABASE_URL
ENV PAYLOAD_SECRET=$PAYLOAD_SECRET
ENV DATABASE_AUTH_TOKEN=$DATABASE_AUTH_TOKEN
ENV DUITKU_MERCHANT_CODE=$DUITKU_MERCHANT_CODE
ENV DUITKU_API_KEY=$DUITKU_API_KEY
ENV DUITKU_ENVIRONMENT=$DUITKU_ENVIRONMENT
ENV DUITKU_CALLBACK_URL=$DUITKU_CALLBACK_URL
ENV DUITKU_RETURN_URL=$DUITKU_RETURN_URL
ENV DUITKU_EXPIRY_PERIOD=$DUITKU_EXPIRY_PERIOD
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV CLOUD_STORAGE_BUCKET=$CLOUD_STORAGE_BUCKET
ENV CLOUD_STORAGE_ENDPOINT=$CLOUD_STORAGE_ENDPOINT
ENV CLOUD_STORAGE_ACCESS_KEY=$CLOUD_STORAGE_ACCESS_KEY
ENV CLOUD_STORAGE_SECRET=$CLOUD_STORAGE_SECRET

# Create user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/public ./public

# Create .next directory with proper ownership
RUN mkdir .next && chown nextjs:nodejs .next

# Copy built application from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Set port environment variable
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
CMD wget --quiet --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start the application with dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]