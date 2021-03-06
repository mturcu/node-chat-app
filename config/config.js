"use strict";

const path = require('path');

const env = process.env.NODE_ENV || 'development';
if (env === 'development' || env === 'test') {
  const jsonConfig = require('./config.json');
  const envConfig = jsonConfig[env];
  Object.keys(envConfig).forEach(key => process.env[key] = envConfig[key]);
}

module.exports = {
  // authHeader: 'x-auth',
  // access: 'auth',
  publicPath: path.join(__dirname, '../public'),
  // secret: process.env.JWT_SECRET,
  // mongoUrl: process.env.MONGODB_URI,
  port: process.env.PORT
}