/* eslint-disable no-console */
const express = require('express');

const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);

interface playersList {
  frame?: any;
  [key: number] : playersList,
  x?: number,
  y?: number,
  playerId?: number,
  currentMessage?: string,
}

const players:playersList = {};

const PORT = process.env.PORT || 3000;
const host = '0.0.0.0';

app.use(express.static(path.resolve(__dirname, '../client/src/dist')));

io.on('connection', (socket: any) => {
  console.log('a user connected');
  players[socket.id] = {
    x: Math.floor(Math.random() * 700) + 50,
    y: Math.floor(Math.random() * 500) + 50,
    playerId: socket.id,
  };
  socket.emit('currentPlayer', players);
  socket.broadcast.emit('newPlayer', players[socket.id]);
  socket.on('disconnect', () => {
    console.log('a user disconnected');
    delete players[socket.id];
    io.emit('userDisconnect', socket.id);
  });
  socket.on('playerMovement', (movementData: {x: number, y: number, frame: number}) => {
    players[socket.id].x = movementData.x;
    players[socket.id].y = movementData.y;
    players[socket.id].frame = movementData.frame;

    socket.broadcast.emit('playerMoved', players[socket.id]);
  });
  socket.on('PlayerMessage', (text: string) => {
    console.log('Got to PlayerMessage: ', text);
    players[socket.id].currentMessage = text;
    io.emit('setPlayerMessage', players[socket.id], text);
  });
});

server.listen(PORT, host, () => {
  console.log(`Listening on port ${PORT}`);
});
