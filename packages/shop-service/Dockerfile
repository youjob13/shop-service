FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY packages/shop-service/package*.json ./packages/shop-service/
COPY packages/shop-service/prisma ./packages/shop-service/prisma/

RUN npm ci

COPY . .

WORKDIR /app/packages/shop-service

RUN npm run prisma:generate
RUN npm run build

# Verify the dist directory exists
RUN ls -la dist || (echo "Build failed - dist directory not found" && exit 1)

FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache postgresql-client bash

COPY package*.json ./
COPY packages/shop-service/package*.json ./packages/shop-service/
COPY packages/shop-service/prisma ./packages/shop-service/prisma/

RUN npm ci --only=production

COPY --from=builder /app/packages/shop-service/dist ./packages/shop-service/dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

WORKDIR /app/packages/shop-service

EXPOSE ${PORT:-3000}

CMD ["sh", "-c", "npm run db:migrate && npm start"] 