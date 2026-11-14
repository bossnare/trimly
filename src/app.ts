import Fastify from 'fastify';
import multipart from '@fastify/multipart';
import { env } from './config/env.ts';
import imageRoutes from './routes/image.route.ts';

const PORT = process.env.PORT || 3000;

export const app = Fastify({
  logger: true,
});

await app.register(multipart, {
  limits: {
    files: 1,
    fileSize: env.MAX_UPLOAD_SIZE,
  },
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
