import multipart from '@fastify/multipart';
import Fastify, { type FastifyError } from 'fastify';
import { env } from './config/env.ts';
import imageRoutes from './routes/image.route.ts';
import { AppError } from './services/image.service.ts';

export const app = Fastify({
  logger: true,
});

await app.register(multipart, {
  limits: {
    files: 1,
    fileSize: env.MAX_UPLOAD_SIZE,
  },
});

// centralise error handler | at the top of multipart plugin registration
app.setErrorHandler((error: FastifyError, request, reply) => {
  request.log.error(error);

  const statusCode = error.statusCode ?? 500;

  if (error instanceof AppError) {
    return reply.code(error.statusCode).send({
      ok: false,
      message: error.message,
    });
  }

  if (error instanceof app.multipartErrors.RequestFileTooLargeError) {
    return reply.code(413).send({
      ok: false,
      message: 'Image exceeds the maximum upload size',
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

  return reply.code(statusCode).send({
    ok: false,
    message: statusCode >= 500 ? 'Internal server error' : error.message,
  });
});

app.get('/health', async () => {
  return {
    status: 'ok',
    service: 'image-processing-api',
  };
});
await app.register(imageRoutes, {
  prefix: '/api/images',
});

// process.on('SIGTERM', () => {
//   console.log('Shutting down...');

//   server.close(() => {
//     console.log('Server closed');
//     process.exit(0);
//   });
// });
