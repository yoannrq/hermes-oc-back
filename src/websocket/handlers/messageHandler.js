export default (io, socket) => {
  console.log('message handler setup');
  /* socket.on('message', (message) => {
    console.log('message received', message);
    io.emit('message', message);
  }); */

  socket.on('message', (roomType, roomId, message) => {
    console.log(`${roomType}${roomId} message received`, message);
    io.to(`${roomType}${roomId}`).emit('message', message);
  });
};
