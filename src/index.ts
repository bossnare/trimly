import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { getProjectFile } from './helpers/file.helper.ts';

const PORT = process.env.PORT || 3000;

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'ok', message: 'Hello from Node.js 26' }));
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('Shutting down...');

  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

const filePath = getProjectFile('src', 'assets', 'image.png');

const stream = createReadStream(filePath);
stream.on('data', (chunk) => {
  console.log('Received:', chunk.length);
});

stream.on('end', () => {
  console.log('Finished');
});
