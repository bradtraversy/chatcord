require("./config/database");
const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { formatMessage, formatBotMessage, getMessages } = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatCord Bot';

// Run when client connects
io.on('connection', socket => {
  socket.on('joinRoom', async ({ username, room }) => {
    const user = await userJoin(socket.id, username, room);

    socket.join(user.room);

    // Send previous messages
    socket.emit('previousMessages', await getMessages(user.room));
    
    // Welcome current user
    socket.emit('message', formatBotMessage(botName, 'Welcome to ChatCord!'));
    

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatBotMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: await getRoomUsers(user.room)
    });
  });

  // Listen for chatMessage
  socket.on('chatMessage', async msg => {
    const user = await getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.room, user.username, msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', async () => {
    const user = await userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatBotMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: await getRoomUsers(user.room)
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
