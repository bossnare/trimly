import sharp, { type Metadata } from 'sharp';
import {
  imageFormatSchema,
  type ResizeOptions,
} from '../schemas/image.schema.ts';
import { env } from '../config/env.ts';

export class ImageValidationError extends Error {
  readonly statusCode: 400 | 415;

  constructor(message: string, statusCode: 400 | 415 = 400) {
    super(message);
    this.name = 'ImageValidationError';
    this.statusCode = statusCode;
  }
}

export async function inspectImage(buffer: Buffer) {
  let metadata: Metadata;

  try {
    const image = sharp(buffer, {
      failOn: 'error',
    });

    metadata = await image.metadata();

    await image.stats(); // forcing Sharp tà decode the image pixels.
  } catch {
    throw new ImageValidationError('Invalid or corrupted image', 400);
  }

  const format = imageFormatSchema.safeParse(metadata.format);

  if (!format.success) {
    throw new ImageValidationError('Unsupported image format', 415);
  }

  if (
    !metadata.width ||
    !metadata.height ||
    metadata.width > env.MAX_IMAGE_WIDTH ||
    metadata.height > env.MAX_IMAGE_HEIGHT
  ) {
    throw new ImageValidationError('Invalid image dimensions');
  }

  return {
    format: metadata.format,
    width: metadata.width,
    height: metadata.height,
    size: buffer.length,
  };
}

export async function resizeImage(buffer: Buffer, options: ResizeOptions) {
  return sharp(buffer)
    .resize({
      width: options.width,
      height: options.height,
      fit: options.fit,
      withoutEnlargement: options.withoutEnlargement,
    })
    .webp()
    .toBuffer();
}
