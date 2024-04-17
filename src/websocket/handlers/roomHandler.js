export default (io, socket) => {
  console.log('setup room handler');
  socket.on('room', (roomType, roomId) => {
    socket.join(`${roomType}${roomId}`);
    console.log(`user ${socket.id} joined ${roomType}${roomId}`);
  });
};
