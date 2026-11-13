import Fastify from 'fastify';

const PORT = process.env.PORT || 3000;

export const app = Fastify({
  logger: true,
});

app.get('/health', async () => {
  return {
    status: 'ok',
    service: 'image-processing-api',
  };
});

// process.on('SIGTERM', () => {
//   console.log('Shutting down...');

//   server.close(() => {
//     console.log('Server closed');
//     process.exit(0);
//   });
// });
