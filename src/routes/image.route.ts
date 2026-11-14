import type { FastifyPluginAsync } from 'fastify';
import { inspectImage } from '../services/image.service.ts';

const imageRoutes: FastifyPluginAsync = async (app) => {
  app.post('/upload', async (request, reply) => {
    const file = await request.file();

    if (!file) {
      return reply.code(400).send({
        ok: false,
        message: 'No image provided',
      });
    }

    const buffer = await file.toBuffer();
    // inject service: inspect
    const image = await inspectImage(buffer);

    return {
      ok: true,
      data: {
        filename: file.filename,
        mimetype: file.mimetype,
        ...image,
      },
      message: 'Image uploaded successfully',
    };
  });
};

export default imageRoutes;
