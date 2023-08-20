const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const createAdapter = require("@socket.io/redis-adapter").createAdapter;
const redis = require("redis");
require("dotenv").config();
const readline = require('readline');
const { createClient } = redis;
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

const botName = "ChatCord Bot";

// * Comment out Code Below when getting an Error: "[nodemon] app crashed - waiting for file changes before starting..."
// (async () => {
//   pubClient = createClient({ url: "redis://127.0.0.1:6379" });
//   await pubClient.connect();
//   subClient = pubClient.duplicate();
//   io.adapter(createAdapter(pubClient, subClient));
// })();
// * ........................... UP UNTIL HERE ............................

// Run when client connects
io.on("connection", (socket) => {
  console.log(io.of("/").adapter);
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit("message", formatMessage(botName, "Welcome to ChatCord!"));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

// * Making Sure a User Enters A PORT within the RANGE 1024 - 49141, NO RESERVED PORTS ALLOWED.
// 1433: Microsoft SQL Server.
// 3306: MySQL Database Server.
// 5432: PostgreSQL Database Server.
// 8080: HTTP alternative port commonly used for web servers.

const readLineObject = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function EnterDifferentPort() {
    readLineObject.question('Enter a PORT Number for the Server within RANGE [1024:49141]: ', (portNumber) => {
        let PORT = parseInt(portNumber);
        // * Checking if the User Chose a Reserved Port Number:
        if (PORT < 1024 || PORT > 49151 || PORT === 1433 || PORT === 3306 || PORT === 5432 || PORT === 8080) {
            console.log('Invalid PORT. Please choose a different PORT: ');
            //  * Enforcing a Valid PORT using Recursion!!.
            EnterDifferentPort();
        } else {
            // Variable to track server status
            let serverRunning = false;
            function startServer() {
                if (serverRunning) {
                    console.log('.. ERROR: Server is Already Running! ..............');
                    console.log('___________________________________________________');
                    displayPrompt();
                    return;
                }
                server.listen(PORT, () => {
                    serverRunning = true;
                    console.log(`Our Multi-User Server is Running on Port: ${PORT} ....`);
                    console.log('___________________________________________________');
                    displayPrompt();
                });
            }
            function stopServer() {
                if (!serverRunning) {
                    console.log('... ERROR: Server is Not Running! .................');
                    console.log('___________________________________________________');
                    return;
                }
                server.close(() => {
                    serverRunning = false;
                    console.log('.. Closed Successfully: Server has been Stopped ...');
                    console.log('___________________________________________________');
                });
            }
            startServer();
            // Command Line Interface for Closing the Server.
            function displayPrompt() {
                const readLineObject1 = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout,
                    terminal: false
                });
                console.log('___________________________________________________');
                readLineObject1.on('line', (input) => {
                    const command = input.trim().toUpperCase();
                    const array = ['CLOSE','QUIT','END','STOP'];
                    if (array.includes(command)) {
                        stopServer();
                    } else {
                        console.log('Unrecognized Command!!');
                        displayPrompt();
                    }
                });
                readLineObject1.on('close', () => {
                    console.log('....... EXITING COMMAND LINE INTERFACE ............');
                    console.log('___________________________________________________');
                    process.exit(0);
                });
            }
        }
    });
}

if (!process.env.PORT) {
  EnterDifferentPort();
} else {
  const PORT = process.env.PORT;
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
