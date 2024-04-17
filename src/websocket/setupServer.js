import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';

import loginRequired from '../middlewares/loginRequired.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const jsFiles = fs.readdirSync(path.join(__dirname, 'handlers')).filter((file) => file.endsWith('.js'));

const setupHandlers = [];

// eslint-disable-next-line no-restricted-syntax
for (const file of jsFiles) {
  // eslint-disable-next-line no-await-in-loop
  const module = await import(`./handlers/${file}`);
  setupHandlers.push(module.default);
}

/**
 *
 * @param {import('socket.io').Server} io
 * */
export default function setupServer(io) {
  io.use((socket, next) => {
    console.log('Check once jwt', socket.handshake.auth.token);
    socket.locals = {
      user: {
        id: 1,
        username: 'test',
      },
    };
    next();
  });

  io.on('connection', (socket) => {
    console.log('a user connected', socket.id, socket.username);
    socket.emit('connected', socket.id);

    socket.on('authenticate', (jwt) => {
      console.log('authenticate', jwt);
    });

    socket.on('hello', (data) => {
      console.log('hello', data, socket.locals.user);
    });

    setupHandlers.forEach((setupHandler) => setupHandler(io, socket));

    socket.on('disconnect', () => {
      console.log('user disconnected', socket.id, socket.username);
    });
  });
}
