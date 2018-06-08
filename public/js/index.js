"use strict";

jQuery('#room-name').focus(() => {
  $.get('/rooms', rooms => {
    let list = '';
    rooms.forEach(room => {
      list += `<option value="${room}">`;
    });
    $('#rooms').html(list);
  });
});