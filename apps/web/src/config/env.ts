import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().url().default("http://localhost:4000/api"),
  NEXT_PUBLIC_MAX_UPLOAD_MB: z.coerce.number().int().positive().default(10),
});

/** Single place where environment variables are read and validated. */
export const env = envSchema.parse({
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_MAX_UPLOAD_MB: process.env.NEXT_PUBLIC_MAX_UPLOAD_MB,
});
