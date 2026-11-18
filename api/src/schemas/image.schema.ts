import { z } from 'zod';

export const allowedImageFormats = ['jpeg', 'png', 'webp', 'avif'] as const;
export const convertImageFormats = ['jpeg', 'png', 'webp', 'avif'] as const;

export const imageFormatSchema = z.enum(allowedImageFormats);

export const resizeImageSchema = z
  .object({
    width: z.coerce.number().int().positive().optional(),
    height: z.coerce.number().int().positive().optional(),
    fit: z
      .enum(['cover', 'contain', 'fill', 'inside', 'outside'])
      .default('inside'),
    withoutEnlargement: z.coerce.boolean().default(true),
  })
  .refine((data) => data.width !== undefined || data.height !== undefined, {
    message: 'At least width or height is required',
  });

export const convertImageSchema = z.object({
  format: z.enum(convertImageFormats),
  quality: z.coerce.number().int().min(1).max(100).default(80),
});

export const compressImageSchema = z.object({
  quality: z.coerce.number().int().min(1).max(100).default(80),
});

export type ResizeImageOptions = z.infer<typeof resizeImageSchema>;
export type ConvertImageOptions = z.infer<typeof convertImageSchema>;
export type CompressImageOptions = z.infer<typeof compressImageSchema>;
