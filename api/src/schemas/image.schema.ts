import { z } from 'zod';

export const allowedImageFormats = ['jpeg', 'png', 'webp', 'avif'] as const;

export const imageFormatSchema = z.enum(allowedImageFormats);

export const resizeSchema = z
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

export type ResizeOptions = z.infer<typeof resizeSchema>;
