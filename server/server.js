"use strict";

const
  http = require('http'),
  express = require('express'),
  socketIO = require('socket.io'),

  {generateMessage, generateLocationMessage, admin, welcome, newcon, cutcon} = require('./utils/message'),
  {Users} = require('./utils/users'),
  {isRealString} = require('./utils/validation'),
  {port, publicPath} = require('../config/config');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
let users = new Users();

app.use(express.static(publicPath));

app.get('/rooms', (req, res) => {
  let existingRooms = [];
  const rooms = io.sockets.adapter.rooms;
  if (rooms) {
    for (let room in rooms) {
      if (!rooms[room].sockets.hasOwnProperty(room)) {
        existingRooms.push(room);
      }
    }
  }
  res.send(existingRooms);
});

io.on('connection', socket => {
  console.log('New connection');
  
  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required');
    }
    params.room = params.room.toLowerCase();
    if (users.getUserList(params.room).findIndex(item => params.name.toLowerCase() === item.toLowerCase()) !== -1) {
      return callback(`Username "${params.name}" already taken, please choose another`);
    }
    socket.join(params.room); //socket.leave(params.room)
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);
    io.to(params.room).emit('updateUserList', users.getUserList(params.room), params.room);
    socket.emit('newMessage', generateMessage(admin, welcome));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage(admin, params.name+newcon+params.room));
    callback();
  });

  socket.on('createMessage', (msg, callback) => {
    const user = users.getUser(socket.id);
    if (user && isRealString(msg.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, msg.text));
    }
    callback(); // optional: ('Server acknowlegement:')
  });

  socket.on('createLocationMessage', coords => {
    const user = users.getUser(socket.id);
    if (user) {
      io.emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  });

  socket.on('disconnect', () => {
    const user = users.removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage(admin, user.name+cutcon+user.room));
      console.log(`Session ${socket.id} disconnected`);
    }
  });

});

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});