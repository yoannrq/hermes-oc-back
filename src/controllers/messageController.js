import messageService from '../services/message/messageService.js';

export default {
  createMessage: async (req, res, next) => {
    const { user } = res.locals;

    // Todo: check user input with zod
    const { roomType, roomId, content } = req.body;

    try {
      const canAccessRoom = await messageService.canAccessRoom({
        roomType,
        roomId,
        userId: user.id,
      });

      if (!canAccessRoom) {
        return next({
          status: 403,
          message: 'You are not allowed to access this room',
        });
      }

      const message = await messageService.createMessage({
        roomType,
        authorId: user.id,
        roomId,
        content,
      });

      await messageService.updateLastMessageRead({
        roomType,
        userId: user.id,
        roomId,
        messageId: message.id,
      });

      return res.status(201).json(message);
    } catch (err) {
      return next({
        status: 500,
        message: 'Internal server error',
        error: err,
      });
    }
  },

  updateMessage: async (req, res, next) => {
    const { user } = res.locals;
    const { content } = req.body;
    const { messageId } = req.params;

    try {
      const updatedMessage = await messageService.updateMessage({
        messageId,
        authorId: user.id,
        content,
      });

      if (!updatedMessage) {
        return res.status(404).json({ message: 'Message not found' });
      }

      return res.status(200).json(updatedMessage);
    } catch (err) {
      return next({
        status: 500,
        message: 'Internal server error',
        error: err,
      });
    }
  },

  deleteMessage: async (req, res, next) => {
    const { messageId } = req.params;
    const { user } = res.locals;

    try {
      const deletedMessage = await messageService.deleteMessage({
        messageId,
        authorId: user.id,
      });

      if (!deletedMessage) {
        return res.status(404).json({ message: 'Message not found' });
      }

      return res.status(200).json(deletedMessage);
    } catch (err) {
      return next({
        status: 500,
        message: 'Internal server error',
        error: err,
      });
    }
  },

  getOneRoomWithMessages: async (req, res, next) => {
    const { user } = res.locals;

    const { roomType } = req.params;
    const roomId = parseInt(req.params.roomId, 10);
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 50;

    try {
      const canAccesRoom = await messageService.canAccessRoom({ roomType, userId: user.id, roomId });

      if (!canAccesRoom) {
        return res.status(403).json({ message: 'You are not allowed to access this room.' });
      }

      const messagesWithPagination = await messageService.getMessagesWithPagination({
        roomType,
        roomId,
        page,
        pageSize,
        originTimestamp: Date.now(),
      });

      return res.status(200).json({
        roomType,
        roomId,
        ...messagesWithPagination,
      });
    } catch (err) {
      return next({
        status: 500,
        message: 'Internal server error',
        error: err,
      });
    }
  },
};
