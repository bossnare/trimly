import type { FastifyPluginAsync } from 'fastify';
import {
  ImageValidationError,
  inspectImage,
  resizeImage,
} from '../services/image.service.ts';
import { resizeSchema } from '../schemas/image.schema.ts';

const imageRoutes: FastifyPluginAsync = async (app) => {
  // upload route
  app.post('/upload', async (request, reply) => {
    try {
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
    } catch (error) {
      if (error instanceof app.multipartErrors.RequestFileTooLargeError) {
        return reply.code(413).send({
          ok: false,
          message: 'Image exceeds the maximum upload size',
        });
      }

      if (error instanceof ImageValidationError) {
        return reply.code(error.statusCode).send({
          ok: false,
          message: error.message,
        });
      }

      if (
        error instanceof app.multipartErrors.FilesLimitError ||
        error instanceof app.multipartErrors.FieldsLimitError ||
        error instanceof app.multipartErrors.PartsLimitError
      ) {
        return reply.code(400).send({
          ok: false,
          message: 'Invalid multipart request',
        });
      }

      request.log.error(error);

      return reply.code(500).send({
        ok: false,
        message: 'Internal server error',
      });
    }
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
