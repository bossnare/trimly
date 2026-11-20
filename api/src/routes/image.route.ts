import type { FastifyPluginAsync } from 'fastify';
import * as z from 'zod';
import { getUploadedFile } from '../helpers/get-uploaded-file.ts';
import {
  compressImageSchema,
  convertImageSchema,
  resizeImageSchema,
} from '../schemas/image.schema.ts';
import { AppError, imageService } from '../services/image.service.ts';

const imageRoutes: FastifyPluginAsync = async (app) => {
  // upload route
  app.post('/upload', async (request, reply) => {
    const file = await getUploadedFile(request);

    if (!file) {
      throw new AppError('No valid image file provided', 400);
    }

    // inject service: inspect
    const image = await imageService.inspectImage(file.buffer);

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
      throw new AppError('No valid image file provided', 400);
    }

    await imageService.inspectImage(file.buffer); // inspect validation image

    const parsed = resizeImageSchema.safeParse(request.query);

    if (!parsed.success) {
      return reply.code(400).send({
        ok: false,
        message: 'Invalid resize options',
        erros: parsed.error.flatten(),
      });
    }

    const result = await imageService.resizeImage(file.buffer, parsed.data);

    return reply.type('image/webp').send(result);
  });

  // convert image route
  app.post('/convert', async (request, reply) => {
    const file = await getUploadedFile(request);

    if (!file) {
      throw new AppError('No valid image file provided', 400);
    }

    await imageService.inspectImage(file.buffer); // inspect validation image

    const parsed = convertImageSchema.safeParse(request.query);

    if (!parsed.success) {
      return reply.code(400).send({
        ok: false,
        message: 'Invalid conversion options',
        erros: parsed.error.flatten(),
      });
    }

    const result = await imageService.convertImage(file.buffer, parsed.data);

    const contentType = `image/${parsed.data.format}`;

    return reply.type(contentType).send(result);
  });

  // compress route
  app.post('/compress', async (request, reply) => {
    const file = await getUploadedFile(request);

    if (!file) {
      throw new AppError('No valid image file provided', 400);
    }

    await imageService.inspectImage(file.buffer); // inspect validation image

    const parsed = compressImageSchema.safeParse(request.query);

    if (!parsed.success) {
      return reply.code(400).send({
        ok: false,
        message: 'Invalid compression options',
        erros: parsed.error.flatten(),
      });
    }

    const result = await imageService.compressImage(file.buffer, parsed.data);

    return reply.type(file.mimetype).send(result);
  });

  app.post('/remove-background', async (request, reply) => {
    const file = await getUploadedFile(request);

    if (!file) {
      throw new AppError('No valid image file provided', 400);
    }

    // inject service: inspect
    await imageService.inspectImage(file.buffer);

    const result = await imageService.removeImageBackground(file.buffer);
    return reply.type('image/png').send(result);
  });
};

export default imageRoutes;
