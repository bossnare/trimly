import { z } from 'zod';

export const rembgModels = [
  'birefnet-general',
  'birefnet-general-lite',
  'birefnet-portrait',
  'isnet-general-use',
  'isnet-anime',
  'u2net',
  'u2netp',
  'u2net_human_seg',
  'u2net_cloth_seg',
  'silueta',
  'sam',
];

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  HOST: z.string().default('0.0.0.0'),
  MAX_UPLOAD_SIZE: z.coerce.number().int().positive().default(10485760), // 10 MB
  MAX_IMAGE_WIDTH: z.coerce.number().int().positive().default(10000),
  MAX_IMAGE_HEIGHT: z.coerce.number().int().positive().default(10000),

  // rembg
  REMBG_URL: z.string().default('http://127.0.0.1:7000'),
  REMBG_TIMEOUT_MS: z.coerce.number().int().positive().default(180000),
  REMBG_MODEL: z.enum(rembgModels).default('birefnet-general'),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error('Invalid environement variables:', result.error.flatten());
  process.exit(1);
}

export const env = result.data;
