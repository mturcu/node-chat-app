"use strict";

const
  expect = require('expect'),
  // test = require('supertest'),

  {generateMessage, generateLocationMessage} = require('../utils/message');
  //{authHeader, access} = require('../config/config');
  // beforeEach(populateTodos);

describe('generateMessage', () => {

  it('should generate correct message object', () => {
    let from = 'Jen';
    let text = 'Some message text';
    let res = generateMessage(from, text);
    expect(res.from).toBe(from);
    expect(res.text).toBe(text);
    expect(typeof res.createdAt).toBe('number');
  });

});

describe('generateLocationMessage', () => {

  it('should generate correct location object', () => {
    let from = 'Don';
    let lat = 44.22;
    let long = -71.15;
    let res = generateLocationMessage(from, lat, long);
    expect(res.from).toBe(from);
    expect(res.url).toBe(`https://www.google.com/maps?q=${lat},${long}`);
    expect(typeof res.createdAt).toBe('number');
  });

});