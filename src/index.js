import { createServer } from 'http';
import './helpers/envLoader.js';
import { Server } from 'socket.io';

import app from './app.js';

const server = createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

io.on('connection', (socket) => {
  console.log('a user connected', socket.id, socket.username);

  socket.emit('connected', socket.id);

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
    socket.broadcast.emit('disconnected', socket.id);
  });

  socket.on('message', (msg) => {
    console.log('message: ' + msg);
    socket.broadcast.emit('message', msg);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
});
