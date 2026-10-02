# Multi-stage production Dockerfile for DXN Orion on Google Cloud Run
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache libc6-compat

# Install node dependencies
COPY package*.json ./
RUN npm ci

# Copy application source
COPY . .

# Generate Prisma Client & Build Vite client + server bundle
RUN npm run build

# Production image
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Install runtime dependencies (e.g. sharp/libvips compatibility if needed)
RUN apk add --no-cache dumb-init

# Copy built assets and dependencies
COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Expose Cloud Run default port
EXPOSE 3000

USER node

ENTRYPOINT ["dumb-init", "--"]
CMD ["npx", "tsx", "server.ts"]
