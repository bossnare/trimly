import { app } from './app.ts';

const start = async () => {
  try {
    await app.listen({
      port: Number(process.env.PORT ?? 3000),
      host: process.env.HOST ?? '0.0.0.0',
    });
  } catch (error) {
    0.0;
    app.log.error(error);
    process.exit(1);
  }
};

start();
