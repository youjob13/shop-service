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
  KAFKA: z.object({
    clientId: z.string(),
    brokers: z.array(z.string()),
  }),
  DATA_SERVICE_URL: z.string().url(),
});

const env = envSchema.parse(process.env);

export const config = {
  ENV: env.NODE_ENV,
  PORT: env.PORT,
  HOST: env.HOST,
  DATABASE_URL: env.DATABASE_URL,
  RATE_LIMIT: env.RATE_LIMIT,
  KAFKA: env.KAFKA,
  DATA_SERVICE_URL: env.DATA_SERVICE_URL,
};
