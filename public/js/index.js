"use strict";

var socket = io();

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

var fTime = time => moment(time).format('h:mm a');

socket.on('newMessage', msg => {
  // console.log('New message:', msg);
  let li = jQuery('<li></li>');
  li.text(`${msg.from} [${fTime(msg.createdAt)}]: ${msg.text}`);
  jQuery('#messages').append(li);
});

socket.on('newLocationMessage', msg => {
  // console.log('New location message:', msg);
  let li = jQuery('<li></li>');
  let a = jQuery('<a target="_blank">My current location</a>');
  li.text(`${msg.from} [${fTime(msg.createdAt)}]: `);
  a.attr('href', msg.url);
  li.append(a);
  jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', e => {
  e.preventDefault();
  let msgTextBox = jQuery('[name=message]');
  socket.emit('createMessage', {
    from: 'User',
    text: msgTextBox.val()
  }, data => {
    msgTextBox.val('');
    // console.log(data, 'Got new message');
  });
});

var locationButton = jQuery('#send-location');
locationButton.on('click', () => {
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