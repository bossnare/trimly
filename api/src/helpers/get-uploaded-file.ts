import type { FastifyRequest } from 'fastify';

export async function getUploadedFile(request: FastifyRequest) {
  const file = await request.file();

  if (!file) return null;

  const buffer = await file.toBuffer();

  if (buffer.length === 0) return null;

  return {
    filename: file.filename,
    mimetype: file.mimetype,
    buffer,
  };
}
