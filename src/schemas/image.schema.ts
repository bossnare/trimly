import { z } from 'zod';

export const allowedImageFormats = ['jpeg', 'png', 'webp', 'avif'] as const;

export const imageFormatSchema = z.enum(allowedImageFormats);
