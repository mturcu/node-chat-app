"use strict";

class Users {
  constructor(id, name, room) {
    this.users = [];
  }
  addUser(id, name, room) {
    let user = {id, name, room};
    this.users.push(user);
    return user;
  }
  // removeUser(id) {
  //   let idx = this.users.findIndex(user => user.id === id);
  //   if (idx < 0) return null;
  //   let user = this.users[idx];
  //   this.users.splice(idx, 1);
  //   return user;
  // }
  removeUser(id) {
    let user = this.getUser(id);
    if (user) this.users = this.users.filter(user => user.id !== id);
    return user;
  }
  getUser(id) {
    return this.users.filter(user => user.id === id)[0];
  }
  getUserList(room) {
    return this.users.filter(user => user.room === room).map(user => user.name);
  }
}

module.exports = {Users};