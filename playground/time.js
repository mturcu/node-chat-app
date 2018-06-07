const moment = require('moment');

var date = moment();
// date.add(1, 'year').subtract(10, 'years');
console.log(date.format('h:mm a'));
