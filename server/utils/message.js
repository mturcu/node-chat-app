"use strict";

const moment = require('moment');

const generateMessage = (from, text) => {
  return {
    from,
    text,
    createdAt: moment().valueOf()
  };
};

const generateLocationMessage = (from, lat, long) => {
  return {
    from,
    url: `https://www.google.com/maps?q=${lat},${long}`,
    createdAt: moment().valueOf()
  };
};

module.exports = 
{
  generateMessage,
  generateLocationMessage,
  admin: 'ChatBot',
  welcome: 'Welcome to the chat app', 
  newcon: ' joined the chat room ',
  cutcon: ' left the chat room '
};