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
*      Noms des canaux de message : [eventType][roomType][roomId]
*      [roomType]: (
*        'Private',
*        'Channel',
*        'Team',
*       )
*      [roomId]: ( nombre entier > 0)
*      Example: 'message:private:1'
*
*    EVENT [patient]:
*     (
*
*     )
* */

/**
 * @param {import('socket.io').Server} io
 * @param {import('socket.io').Socket} socket
 * */
export default (io, socket) => {
  socket.on('socketRoom:join:message', ({ roomType, roomId }) => {
    const { user } = socket.locals;
    socket.join(`${roomType}${roomId}`);
  });

  socket.on('socketRoom:join:patient', ({}) => {

  });
};
