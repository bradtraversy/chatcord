const ActiveUser = require("../models/User");

// Join user to chat
function userJoin(id, username, room) {
  return ActiveUser.findOneAndUpdate({ username, room }, { clientId: id }, {
    new: true,
    upsert: true
  });
}

// Get current user
function getCurrentUser(id) {
  return ActiveUser.findOne({ clientId: id });
}

// User leaves chat
function userLeave(id) {
  return ActiveUser.findOneAndDelete({ clientId: id });
}

// Get room users
function getRoomUsers(room) {
  return ActiveUser.find({ room });
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
};
