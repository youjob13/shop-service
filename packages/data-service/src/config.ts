import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('0.0.0.0'),
  DATABASE_URL: z.string().url(),
  RATE_LIMIT: z
    .object({
      max: z.number(),
      timeWindow: z.union([z.string(), z.number()]),
    })
    .default({
      max: 100,
      timeWindow: '1 minute',
    }),
  KAFKA_BROKERS: z.string().default('kafka:9092'),
  KAFKA_CLIENT_ID: z.string().default('shop-service'),
  KAFKA_GROUP_ID: z.string().default('shop-service'),
  KAFKA_CONSUMER_SESSION_TIMEOUT: z.number().default(30000),
});

const env = envSchema.parse(process.env);

export const config = {
  ENV: env.NODE_ENV,
  PORT: env.PORT,
  HOST: env.HOST,
  DATABASE_URL: env.DATABASE_URL,
  RATE_LIMIT: env.RATE_LIMIT,
  KAFKA_BROKERS: env.KAFKA_BROKERS,
  KAFKA_CLIENT_ID: env.KAFKA_CLIENT_ID,
  KAFKA_GROUP_ID: env.KAFKA_GROUP_ID,
  KAFKA_CONSUMER_SESSION_TIMEOUT: env.KAFKA_CONSUMER_SESSION_TIMEOUT,
};
