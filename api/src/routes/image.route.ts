import type { FastifyPluginAsync } from 'fastify';
import {
  compressImage,
  convertImage,
  inspectImage,
  resizeImage,
} from '../services/image.service.ts';
import {
  compressImageSchema,
  convertImageSchema,
  resizeImageSchema,
} from '../schemas/image.schema.ts';
import { getUploadedFile } from '../helpers/get-uploaded-file.ts';
import '@fastify/multipart';

const imageRoutes: FastifyPluginAsync = async (app) => {
  // upload route
  app.post('/upload', async (request, reply) => {
    const file = await getUploadedFile(request);

    if (!file) {
      return reply.code(400).send({
        ok: false,
        message: 'No valid image file provided',
      });
    }

    // inject service: inspect
    const image = await inspectImage(file.buffer);

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
    const file = await getUploadedFile(request);

    if (!file) {
      return reply.code(400).send({
        ok: false,
        message: 'No valid image file provided',
      });
    }

    await inspectImage(file.buffer); // inspect validation image

    const parsed = resizeImageSchema.safeParse(request.query);

    if (!parsed.success) {
      return reply.code(400).send({
        ok: false,
        message: 'Invalid resize options',
        erros: parsed.error.flatten(),
      });
    }

    const result = await resizeImage(file.buffer, parsed.data);

    return reply.type('image/webp').send(result);
  });

  // convert image route
  app.post('/convert', async (request, reply) => {
    const file = await getUploadedFile(request);

    if (!file) {
      return reply.code(400).send({
        ok: false,
        message: 'No valid image file provided',
      });
    }

    await inspectImage(file.buffer); // inspect validation image

    const parsed = convertImageSchema.safeParse(request.query);

    if (!parsed.success) {
      return reply.code(400).send({
        ok: false,
        message: 'Invalid conversion options',
        erros: parsed.error.flatten(),
      });
    }

    const result = await convertImage(file.buffer, parsed.data);

    const contentType = `image/${parsed.data.format}`;

    return reply.type(contentType).send(result);
  });

  // compress route
  app.post('/compress', async (request, reply) => {
    const file = await getUploadedFile(request);

    if (!file) {
      return reply.code(400).send({
        ok: false,
        message: 'No valid image file provided',
      });
    }

    await inspectImage(file.buffer); // inspect validation image

    const parsed = compressImageSchema.safeParse(request.query);

    if (!parsed.success) {
      return reply.code(400).send({
        ok: false,
        message: 'Invalid compression options',
        erros: parsed.error.flatten(),
      });
    }

    const result = await compressImage(file.buffer, parsed.data);

    return reply.type(file.mimetype).send(result);
  });

  app.post('/remove-background', async (request, reply) => {
    return reply.code(200).send({
      implementation: 'loading',
    });
  });
};

export default imageRoutes;
