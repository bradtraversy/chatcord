const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', message => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', e => {
  e.preventDefault();
  
  // Get the message input field
  const messageField = e.target.elements.msg;

  // Emit message to server
  socket.emit('chatMessage', messageField.value);

  // Clear input
  messageField.value = '';
  messageField.focus();
});

// Output message to DOM
function outputMessage(message) {
  document.querySelector('.chat-messages').innerHTML += `<div class="message">
  <p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p></div>`;
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = users.map(user => `<li>${user.username}</li>`).join('');
}
