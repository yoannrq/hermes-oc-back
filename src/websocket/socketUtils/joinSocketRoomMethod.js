export default (socket, roomName, roomArgs, callback) => {
  const { roomId, roomType } = roomArgs;
  const { user } = socket.locals;
  let socketRoomId;

  if (roomType) {
    socketRoomId = `${roomName}:${roomType}:${roomId}`;
  } else {
    socketRoomId = `${roomName}:${roomId}`;
  }

  socket.join(socketRoomId);

  socket.to(socketRoomId).emit('userJoinRoom', {
    room: { roomName, roomArgs },
    user,
  });

  console.log(`${user.id} has join '${socketRoomId}'`);

  callback({
    success: true,
    message: `${user.id} has join '${socketRoomId}'`,
  });
};
