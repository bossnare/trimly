import sharp from 'sharp';

export async function inspectImage(buffer: Buffer) {
  const metadata = await sharp(buffer).metadata();

  if (!metadata.format || !metadata.width || !metadata.height) {
    throw new Error('Invalid image');
  }

  return {
    format: metadata.format,
    width: metadata.width,
    height: metadata.height,
    size: buffer.length,
  };
}
