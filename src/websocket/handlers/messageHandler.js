export default {
  joinMessageRoom(io, socket) {
    return ({ roomType, roomId }, callback) => {
      const { user } = socket.locals;

      const roomName = 'message';
      const roomArgs = { roomId, roomType };
      const socketRoomId = `${roomName}:${roomType}:${roomId}`;
      socket.join(socketRoomId);

      socket.to(socketRoomId).emit('userJoinRoom', {
        room: { roomName, roomArgs },
        user,
      });

      console.log(`${user.id} has join 'message:${roomType}:${roomId}'`);

      callback({
        message: `${user.id} has join 'message:${roomType}:${roomId}'`,
      });
    };
  },

  leaveMessageRoom(io, socket) {
    return ({ roomType, roomId }, callback) => {
      const { user } = socket.locals;

      const roomName = 'message';
      const roomArgs = { roomId, roomType };
      const socketRoomId = `${roomName}:${roomType}:${roomId}`;
      socket.leave(socketRoomId);

      socket.to(socketRoomId).emit('userJoinRoom', {
        room: { roomName, roomArgs },
        user,
      });

      console.log(`${user.id} has left 'message:${roomType}:${roomId}'`);

      callback({
        message: `${user.id} has left 'message:${roomType}:${roomId}'`,
      });
    };
  },

  listRooms(io, socket) {
    return () => {
      const { user } = socket.locals;

      const roomList = socket.rooms;
      console.log(`Room list for userId = ${user.id} : `, roomList);

      socket.emit('ok socket list');
    };
  },
};
