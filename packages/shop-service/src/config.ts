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
});

const env = envSchema.parse(process.env);

export const config = {
  env: env.NODE_ENV,
  port: env.PORT,
  host: env.HOST,
  databaseUrl: env.DATABASE_URL,
  rateLimit: env.RATE_LIMIT,
};
