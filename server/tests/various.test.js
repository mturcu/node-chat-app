"use strict";

const
  expect = require('expect'),
 
  {generateMessage, generateLocationMessage} = require('../utils/message'),
  {isRealString} = require('../utils/validation');

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

describe('isRealString', () => {
  it('should reject non string values', () => {
    let res = isRealString(98);
    expect(res).toBe(false);
  });
  it('should reject blank strings', () => {
    let res = isRealString('    ');
    expect(res).toBe(false);
  });
  it('should allow strings with non-space chars', () => {
    let res = isRealString(' Test Name   ');
    expect(res).toBe(true);
  });
});