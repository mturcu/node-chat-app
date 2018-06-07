"use strict";

const
  http = require('http'),
  express = require('express'),
  socketIO = require('socket.io'),

  {generateMessage, generateLocationMessage, admin, welcome, newcon} = require('./utils/message'),
  {port, publicPath} = require('../config/config');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', socket => {
  console.log(newcon);

  socket.emit('newMessage', generateMessage(admin, welcome));

  socket.broadcast.emit('newMessage', generateMessage(admin, newcon));

  socket.on('createMessage', (msg, callback) => {
    msg = generateMessage(msg.from, msg.text);
    console.log('createMessage', msg);
    io.emit('newMessage', msg);
    callback(); //'Server acknowlegement:');
  });

  socket.on('createLocationMessage', coords => {
    io.emit('newLocationMessage', generateLocationMessage('User', coords.latitude, coords.longitude));
  });

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });

});

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});