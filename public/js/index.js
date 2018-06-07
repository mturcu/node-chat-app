"use strict";

var socket = io();

var scrollToBottom = force => {
  // Selectors
  let messages = jQuery('#messages');
  let newMsg = messages.children('li:last-child');
  // Heights
  let clientHeight = messages.prop('clientHeight');
  let scrollTop = messages.prop('scrollTop');
  let scrollHeight = messages.prop('scrollHeight');
  let newMsgHeight = newMsg.innerHeight();
  let lastMsgHeight = newMsg.prev().innerHeight();
  if ((clientHeight + scrollTop + newMsgHeight + lastMsgHeight >= scrollHeight) || force) {
    messages.scrollTop(scrollHeight);
  }
};

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

var fTime = time => moment(time).format('h:mm a');

socket.on('newMessage', msg => {
  let template = jQuery('#message-template').html();
  let html = Mustache.render(template, {
    text: msg.text,
    from: msg.from,
    createdAt: fTime(msg.createdAt)
  });
  jQuery('#messages').append(html);
  scrollToBottom();
});

socket.on('newLocationMessage', msg => {
  let template = jQuery('#location-message-template').html();
  let html = Mustache.render(template, {
    from: msg.from,
    url: msg.url,
    createdAt: fTime(msg.createdAt)
  });
  jQuery('#messages').append(html);
  scrollToBottom();
});

jQuery('#message-form').on('submit', e => {
  e.preventDefault();
  let msgTextBox = jQuery('[name=message]');
  socket.emit('createMessage', {
    from: 'User',
    text: msgTextBox.val()
  }, () => {
    msgTextBox.val('');
    scrollToBottom(true);
  });
});

var locationButton = jQuery('#send-location');
locationButton.on('click', () => {
  scrollToBottom(true);
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser');
  }
  locationButton.attr('disabled', 'disabled').text('Sending location...');
  navigator.geolocation.getCurrentPosition(position => {
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, () => {
    alert('Unable to fetch location.');
    locationButton.removeAttr('disabled').text('Send location');
  })
});