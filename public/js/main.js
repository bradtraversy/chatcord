const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
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
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on('newImg', (user, img, color) => {
  displayImage(user, img, color);
});

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});
// Output Image to DOM
function displayImage(user, imgData, color) {
  const div = document.createElement('div');
  div.classList.add('newImg');
  const msgToDisplay = document.createElement('p'),
    date = new Date().toTimeString().substr(0, 8);
  msgToDisplay.style.color = color || '#000';
  msgToDisplay.innerHTML = user + '<span class="timespan">(' + date + '): </span> <br/>' + '<a href="' + imgData + '" target="_blank"><img src="' + imgData + '"/></a>';
  div.appendChild(msgToDisplay);
  // div.scrollTop = div.scrollHeight;
  document.querySelector('.chat-messages').appendChild(div);
}
// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}
document.getElementById('sendImage').addEventListener('change', function() {
  if (this.files.length != 0) {
      var file = this.files[0],
          reader = new FileReader(),
          color = document.getElementById('colorStyle').value;
      if (!reader) {
          that.outputMessage('!your browser doesn\'t support fileReader');
          this.value = '';
          return;
      };
      reader.onload = function(e) {
          this.value = '';
          socket.emit('img', e.target.result, color);
          displayImage('me', e.target.result, color);
      };
      reader.readAsDataURL(file);
  };
}, false);
//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});
