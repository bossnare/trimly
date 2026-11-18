import sharp, { type Metadata } from 'sharp';
import {
  imageFormatSchema,
  type CompressImageOptions,
  type ConvertImageOptions,
  type ResizeImageOptions,
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

    await image.stats(); // forcing Sharp decode the image pixels.
  } catch (error) {
    throw new ImageValidationError(
      'Invalid image format or corrupted image',
      400
    );
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

export async function resizeImage(buffer: Buffer, options: ResizeImageOptions) {
  return sharp(buffer)
    .resize({
      width: options.width,
      height: options.height,
      fit: options.fit,
      withoutEnlargement: options.withoutEnlargement,
    })
    .webp() // return output to webp format for V1
    .toBuffer();
}

export async function convertImage(
  buffer: Buffer,
  options: ConvertImageOptions
) {
  return sharp(buffer)
    .toFormat(options.format, {
      quality: options.quality,
    })
    .toBuffer();
}

export async function compressImage(
  buffer: Buffer,
  options: CompressImageOptions
) {
  const image = sharp(buffer);
  const metadata = await image.metadata();

  switch (metadata.format) {
    case 'jpeg':
      return image
        .jpeg({
          quality: options.quality,
          mozjpeg: true,
        })
        .toBuffer();

    case 'png':
      return image
        .png({
          compressionLevel: 9,
          adaptiveFiltering: true,
        })
        .toBuffer();

    case 'webp':
      return image
        .webp({
          quality: options.quality,
        })
        .toBuffer();

    case 'avif':
      return image
        .avif({
          quality: options.quality,
        })
        .toBuffer();
  }
}
