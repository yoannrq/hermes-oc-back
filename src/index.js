import { createServer } from 'http';
import './helpers/envLoader.js';
import { Server } from 'socket.io';

import app from './app.js';

import setupWebsocket from './websocket/setupServer.js';

const server = createServer(app);
const io = new Server(server);
setupWebsocket(io);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
});
