# 1. Base Image
FROM node:20-slim AS base

# 2. Set working directory
WORKDIR /app

# 3. Install dependencies
COPY package*.json ./
RUN npm ci

# 4. Copy source code
COPY . .

# 5. Generate Prisma Client
RUN npx prisma generate

# 6. Build the application
RUN npm run build

# 7. Production Image
FROM node:20-slim AS production

WORKDIR /app

# Copy built assets from the 'base' stage
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/package.json .
COPY --from=base /app/node_modules ./node_modules

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
