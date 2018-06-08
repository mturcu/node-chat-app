"use strict";

const
  http = require('http'),
  express = require('express'),
  socketIO = require('socket.io'),

  {generateMessage, generateLocationMessage, admin, welcome, newcon, cutcon} = require('./utils/message'),
  {Users} = require('./utils/users'),
  {isRealString} = require('./utils/validation'),
  {port, publicPath} = require('../config/config');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', socket => {
  console.log('New user'+newcon);
  
  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required');
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
    let user = users.getUser(socket.id);
    if (user && isRealString(msg.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, msg.text));
    }
    callback(); //'Server acknowlegement:');
  });

  socket.on('createLocationMessage', coords => {
    let user = users.getUser(socket.id);
    if (user) {
      io.emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  });

  socket.on('disconnect', () => {
    let user = users.removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage(admin, user.name+cutcon+user.room));
      console.log('User was disconnected');
    }
  });

});

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});