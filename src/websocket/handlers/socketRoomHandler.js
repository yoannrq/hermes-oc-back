/**
* Les noms des cannaux d'événements Websocket s'écrivent sans espace avec
* des doubles points en séparateur sous la forme: '[eventType]:[eventContext]'
* Exemple : 'message:private:1'
*
* [eventType] : (
*   'message',
*   'patient',
*   'user',
* )
*
* [eventContext]: Dépend de l'eventType
*    EVENT : [message]:
*      Noms des canaux de message : [eventType]:[roomType]:[roomId]
*      [roomType]: (
*        'Private',
*        'Channel',
*        'Team',
*       )
*      [roomId]: ( nombre entier > 0)
*      Example: 'message:private:1'
*
*    EVENT [patient]:
*      Noms des canaux de patient : [eventType]:[patientId]
*     (
*
*     )
* */

/**
 * @param {import('socket.io').Server} io
 * @param {import('socket.io').Socket} socket
 * */
export default (io, socket) => {
  // Ecouteur d'événement pour rejoindre une socketRoom de type message
  socket.on('socketRoom:join:message', ({ roomType, roomId }, callback) => {
    const { user } = socket.locals;

    socket.join(`message:${roomType}:${roomId}`);

    socket.emit(`${user.id} has join 'message:${roomType}:${roomId}'`);

    console.log(`${user.id} has join 'message:${roomType}:${roomId}'`);

    callback({
      message: `${user.id} has join 'message:${roomType}:${roomId}'`,
    });
  });

  // Ecouteur d'événement pour quitter une socketRoom de type message
  socket.on('socketRoom:leave:message', ({ roomType, roomId }, callback) => {
    const { user } = socket.locals;

    socket.leave(`message:${roomType}:${roomId}`);

    socket.emit(`${user.id} has left 'message:${roomType}:${roomId}'`);

    console.log(`${user.id} has left 'message:${roomType}:${roomId}'`);

    callback({
      message: `${user.id} has left 'message:${roomType}:${roomId}'`,
    });
  });

  // Ecouteur d'événement pour lister les socketRoom
  socket.on('socketRoom:list', () => {
    const { user } = socket.locals;

    const roomList = socket.rooms;
    console.log(`Room list for userId = ${user.id} : `, roomList);

    socket.emit('ok socket list');
  });

  socket.on('socketRoom:join:patient', ({}) => {

  });
};
