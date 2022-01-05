const Message = require("../models/Message");

function formatMessage(room, username, text) {
  const date = new Date();
  const newMessage = new Message(
    {
      text,
      username,
      room,
      date
    }
  );
  const errors = newMessage.validateSync();
  newMessage.save();
    return {
      username,
      text,
      date
    };
}

function formatBotMessage(username, text) {
  const date = new Date();
  return {
    username,
    text,
    date
  };
}

function getMessages(room) {
  return Message.find({ room }).limit(100).sort('date').lean();
}

module.exports = {
  formatMessage,
  formatBotMessage,
  getMessages
};
