"use strict";

const socket = io();

const scrollToBottom = force => {
  // Selectors
  const messages = jQuery('#messages');
  const newMsg = messages.children('li:last-child');
  // Heights
  const clientHeight = messages.prop('clientHeight');
  const scrollTop = messages.prop('scrollTop');
  const scrollHeight = messages.prop('scrollHeight');
  const newMsgHeight = newMsg.innerHeight();
  const lastMsgHeight = newMsg.prev().innerHeight();
  if ((clientHeight + scrollTop + newMsgHeight + lastMsgHeight >= scrollHeight) || force) {
    messages.scrollTop(scrollHeight);
  }
};

socket.on('connect', () => {
  console.log('Connected to server');
  const params = jQuery.deparam(window.location.search);
  socket.emit('join', params, err => {
    if (err) {
      alert(err);
      window.location.href = '/';
    }
    else {
      console.log('No join error');
    }
  });
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('updateUserList', (users, room) => {
  jQuery('#room-name').text(`People in [${room}]`);
  let ul = jQuery('<ul style="list-style-type:none"></ul>');
  users.forEach(user => ul.append(jQuery('<li></li>').text(user)));
  jQuery('#users').html(ul);
});

const fTime = time => moment(time).format('H:mm:ss');

socket.on('newMessage', msg => {
  const template = jQuery('#message-template').html();
  const html = Mustache.render(template, {
    text: msg.text,
    from: msg.from,
    createdAt: fTime(msg.createdAt)
  });
  jQuery('#messages').append(html);
  scrollToBottom();
});

socket.on('newLocationMessage', msg => {
  const template = jQuery('#location-message-template').html();
  const html = Mustache.render(template, {
    from: msg.from,
    url: msg.url,
    createdAt: fTime(msg.createdAt)
  });
  jQuery('#messages').append(html);
  scrollToBottom();
});

jQuery('#message-form').on('submit', e => {
  e.preventDefault();
  const msgTextBox = jQuery('[name=message]');
  if (msgTextBox.val().trim().length > 0)
    socket.emit('createMessage', { text: msgTextBox.val() }, () => scrollToBottom(true));
  msgTextBox.val('');
  msgTextBox.focus();
});

const locationButton = jQuery('#send-location');
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
    scrollToBottom(true);
    jQuery('[name=message]').focus();
  }, () => {
    alert('Unable to fetch location');
    locationButton.removeAttr('disabled').text('Send location');
  })
});