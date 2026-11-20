import sharp, { type Metadata } from 'sharp';
import { env } from '../config/env.ts';
import {
  imageFormatSchema,
  type CompressImageOptions,
  type ConvertImageOptions,
  type ResizeImageOptions,
} from '../schemas/image.schema.ts';

export class AppError extends Error {
  public readonly statusCode: number;

  constructor(
    message: string,
    statusCode: number = 500,
    options?: ErrorOptions
  ) {
    super(message, options);
    this.name = new.target.name;
    this.statusCode = statusCode;
  }
}

export class ImageValidationError extends AppError {
  constructor(
    message: string,
    statusCode: number = 422,
    options?: ErrorOptions
  ) {
    super(message, statusCode, options);
  }
}

export class ImageService {
  async inspectImage(buffer: Buffer) {
    let metadata: Metadata;

    try {
      const image = sharp(buffer, {
        failOn: 'error',
      });

      metadata = await image.metadata();

      await image.stats();
    } catch (error) {
      throw new ImageValidationError(
        'Invalid image format or corrupted image',
        422,
        { cause: error }
      );
    }

    const formatName =
      metadata.format === 'heif' && metadata.mediaType === 'image/avif'
        ? 'avif'
        : metadata.format;

    const format = imageFormatSchema.safeParse(formatName);

    if (!format.success) {
      throw new ImageValidationError('Unsupported image format', 415);
    }

    if (
      !metadata.width ||
      !metadata.height ||
      metadata.width > env.MAX_IMAGE_WIDTH ||
      metadata.height > env.MAX_IMAGE_HEIGHT
    ) {
      throw new ImageValidationError('Invalid image dimensions', 422);
    }

    return {
      format: format.data,
      width: metadata.width,
      height: metadata.height,
      size: buffer.length,
    };
  }

  async resizeImage(buffer: Buffer, options: ResizeImageOptions) {
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

  async convertImage(buffer: Buffer, options: ConvertImageOptions) {
    return sharp(buffer)
      .toFormat(options.format, {
        quality: options.quality,
      })
      .toBuffer();
  }

  async compressImage(buffer: Buffer, options: CompressImageOptions) {
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

      case 'heif':
        return image
          .avif({
            quality: options.quality,
          })
          .toBuffer();

      default:
        throw new ImageValidationError(
          'Unsupported image format for compression',
          415
        );
    }
  }

  async removeImageBackground(input: Buffer) {
    const formData = new FormData();

    formData.append('file', new Blob([new Uint8Array(input)]), 'image');
    formData.append('model', env.REMBG_MODEL);

    try {
      const response = await fetch(`${env.REMBG_URL}/api/remove`, {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(env.REMBG_TIMEOUT_MS),
      });

      if (!response.ok) {
        const details = (await response.text()).slice(0, 800);

        throw new AppError(
          `Background removal failed: (${response.status}: ${details})`,
          502
        );
      }

      const contentType = response.headers.get('content-type');

      if (!contentType?.includes('image/png')) {
        throw new AppError(
          'Invalid response from background removal server.',
          502
        );
      }

      return Buffer.from(await response.arrayBuffer());
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'TimeoutError') {
          throw new AppError('Background removal timed out', 504, {
            cause: error,
          });
        }

        if (error.name === 'TypeError') {
          throw new AppError('Background removal server unavailable', 503, {
            cause: error,
          });
        }
      }

      throw error;
    }
  }
}

export const imageService = new ImageService();
