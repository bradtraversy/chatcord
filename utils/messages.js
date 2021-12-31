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
      time: date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    };
}

function formatBotMessage(username, text) {
  const date = new Date();
  return {
    username,
    text,
    time: date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  };
}

async function getMessages(room) {
  const messages = await Message.find({ room }).limit(100).sort('date').lean();
  messages.map(message => {
    message.time = new Date(message.date).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  });
  return messages;
}

module.exports = {
  formatMessage,
  formatBotMessage,
  getMessages
};
