FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY packages/data-service/package*.json ./packages/data-service/
COPY packages/core/package*.json ./packages/core/
COPY packages/dto/package*.json ./packages/dto/
COPY packages/kafka-client/package*.json ./packages/kafka-client/
COPY packages/shared/package*.json ./packages/shared/

COPY tsconfig*.json ./
COPY packages/data-service/tsconfig*.json ./packages/data-service/
COPY packages/core/tsconfig*.json ./packages/core/
COPY packages/dto/tsconfig*.json ./packages/dto/
COPY packages/kafka-client/tsconfig*.json ./packages/kafka-client/
COPY packages/shared/tsconfig*.json ./packages/shared/

COPY packages/data-service/prisma ./packages/data-service/prisma/

RUN npm ci

COPY . .

RUN npm run --workspace=packages/dto build
RUN npm run --workspace=packages/shared build
RUN npm run --workspace=packages/core build
RUN npm run --workspace=packages/kafka-client build

WORKDIR /app/packages/data-service

RUN npm run prisma:generate
RUN npm run build

# Verify the dist directory exists
RUN ls -la dist || (echo "Build failed - dist directory not found" && exit 1)

FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache postgresql-client bash

COPY package*.json ./
COPY packages/data-service/package*.json ./packages/data-service/
COPY packages/core/package*.json ./packages/core/
COPY packages/dto/package*.json ./packages/dto/
COPY packages/kafka-client/package*.json ./packages/kafka-client/
COPY packages/shared/package*.json ./packages/shared/

COPY packages/data-service/prisma ./packages/data-service/prisma/

RUN npm ci --only=production

COPY --from=builder /app/packages/data-service/dist ./packages/data-service/dist
COPY --from=builder /app/packages/core/dist ./packages/core/dist
COPY --from=builder /app/packages/dto/dist ./packages/dto/dist
COPY --from=builder /app/packages/kafka-client/dist ./packages/kafka-client/dist
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Create symlinks to ensure imports work correctly
RUN mkdir -p /app/node_modules/@shop
RUN ln -s /app/packages/core /app/node_modules/@shop/core
RUN ln -s /app/packages/dto /app/node_modules/@shop/dto
RUN ln -s /app/packages/kafka-client /app/node_modules/@shop/kafka-client
RUN ln -s /app/packages/shared /app/node_modules/@shop/shared


# RUN addgroup -S appgroup && adduser -S appuser -G appgroup
# RUN chown -R appuser:appgroup /app
# USER appuser

WORKDIR /app/packages/data-service

# Verify the dist directory exists
RUN ls -la dist || (echo "Build failed - dist directory not found" && exit 1)

EXPOSE ${PORT:-3003}

CMD ["sh", "-c", "npm run db:migrate && npm start"] 