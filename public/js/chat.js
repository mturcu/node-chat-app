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
  var params = jQuery.deparam(window.location.search);
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

var fTime = time => moment(time).format('H:mm:ss');

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
  if (msgTextBox.val() != '') {
    socket.emit('createMessage', {
      text: msgTextBox.val()
    }, () => {
      msgTextBox.val('');
      scrollToBottom(true);
    });
  };
  msgTextBox.focus();
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
    scrollToBottom(true);
    jQuery('[name=message]').focus();
  }, () => {
    alert('Unable to fetch location');
    locationButton.removeAttr('disabled').text('Send location');
  })
});