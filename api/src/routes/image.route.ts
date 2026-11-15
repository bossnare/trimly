import type { FastifyPluginAsync } from 'fastify';
import { inspectImage, resizeImage } from '../services/image.service.ts';
import { resizeSchema } from '../schemas/image.schema.ts';

const imageRoutes: FastifyPluginAsync = async (app) => {
  // upload route
  app.post('/upload', async (request, reply) => {
    const file = await request.file();

    if (!file) {
      return reply.code(400).send({
        ok: false,
        message: 'No image provided',
      });
    }

    const buffer = await file.toBuffer();

    if (buffer.length === 0) {
      return reply.code(400).send({
        ok: false,
        message: 'Empty file',
      });
    }

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

  // resize route
  app.post('/resize', async (request, reply) => {
    const file = await request.file();

    if (!file) {
      return reply.code(400).send({
        ok: false,
        message: 'No image provided',
      });
    }

    const buffer = await file.toBuffer();

    if (buffer.length === 0) {
      return reply.code(400).send({
        ok: false,
        message: 'Empty file',
      });
    }

    const parsed = resizeSchema.safeParse(request.query);

    if (!parsed.success) {
      return reply.code(400).send({
        ok: false,
        message: 'Invalid resize options',
        erros: parsed.error.flatten(),
      });
    }

    await inspectImage(buffer); // inspect validation image

    const result = await resizeImage(buffer, parsed.data);

    return reply.type('image/webp').send(result);
  });
};

export default imageRoutes;
