"use strict";

const
  express = require('express'),

  {port, publicPath} = require('../config/config');

var app = express();

app.use(express.static(publicPath));

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});