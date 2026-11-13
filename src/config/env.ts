import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  HOST: z.string().default('0.0.0.0'),
  MAX_UPLOAD_SIZE: z.coerce.number().int().positive().default(10485760), // 10 MB
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error('Invalid environement variables:', result.error.flatten());
  process.exit(1);
}

export const env = result.data;
