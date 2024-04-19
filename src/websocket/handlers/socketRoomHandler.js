import socketRoomSchema from '../../utils/validation/socketRoomSchema.js';
import messageService from '../../services/message/messageService.js';
import joinSocketRoomMethod from '../socketUtils/joinSocketRoomMethod.js';

export default {
  joinMessageRoom(io, socket) {
    return async (args, callback) => {
      const { user } = socket.locals;
      const { roomType, roomId } = args;

      const roomName = 'message';

      // Vérification du schéma des arguments de la room
      const { success, data, error } = socketRoomSchema.safeParse({ roomType, roomId });
      if (!success) {
        if (callback) {
          callback({
            success: false,
            message: 'Schema validation error.',
            error: error.errors,
          });
        }
        return;
      }

      const roomArgs = data;

      const canAccessRoom = await messageService.canAccessRoom({
        roomType,
        roomId,
        userId: user.id,
      });

      if (!canAccessRoom) {
        if (callback) {
          callback({
            success: false,
            message: 'You are not allowed to access this room',
          });
        }
        return;
      }

      joinSocketRoomMethod(socket, roomName, roomArgs, callback);
    };
  },

  leaveMessageRoom(io, socket) {
    return ({ roomType, roomId }, callback) => {
      const { user } = socket.locals;

      const roomName = 'message';
      const { success, data, error } = socketRoomSchema.safeParse({ roomId, roomType });

      if (!success) {
        if (callback) {
          callback({
            errors: error.errors,
          });
        }
        return;
      }

      const roomArgs = { data };
      const socketRoomId = `${roomName}:${roomType}:${roomId}`;
      socket.leave(socketRoomId);

      socket.to(socketRoomId).emit('userJoinRoom', {
        room: { roomName, roomArgs },
        user,
      });

      console.log(`${user.id} has left 'message:${roomType}:${roomId}'`);

      if (callback) {
        callback({
          message: `${user.id} has left 'message:${roomType}:${roomId}'`,
        });
      }
    };
  },

  listRooms(io, socket) {
    return () => {
      const { user } = socket.locals;

      const roomList = socket.rooms;
      console.log(`userId = ${user.id}, roomList = `, roomList);

      socket.to('roomList').emit(roomList);
    };
  },
};
