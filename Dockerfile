# Base stage for dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Install additional optimization tools
RUN apk add --no-cache libc6-compat

# Copy package files and install dependencies including critters
COPY package.json package-lock.json ./
RUN npm ci && npm install critters

# Builder stage
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Copy environment variables for build
COPY .env.production .env.production

# Set build-time optimizations
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build application with optimizations
RUN npm run build

# Runner stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Install production optimization packages
RUN apk add --no-cache tini

# Copy necessary files with optimized permissions
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Set proper permissions
RUN chown -R nextjs:nodejs .

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Use tini as init system
ENTRYPOINT ["/sbin/tini", "--"]

# Start the application with optimized flags
CMD ["node", "--max-old-space-size=256", "server.js"]
