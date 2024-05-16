import { createServer } from 'http';
import './helpers/envLoader.js';
import { Server } from 'socket.io';

import app from './app.js';

import setupWebsocket from './websocket/setupServer.js';

const server = createServer(app);

const ioOptions = process.env.NODE_ENV === 'production'
  ? // Production options
  {
    cors: {
      origin: process.env.APP_URL,
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
      credentials: true,
    },
  }
  : // Development options
  {
    cors: { origin: 'http://localhost:5173' },
  };

const io = new Server(server, ioOptions);

app.set('io', io);
setupWebsocket(io);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}/api`);
});
