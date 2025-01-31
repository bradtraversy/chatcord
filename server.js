const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const dotenv = require("dotenv");
dotenv.config();
const createAdapter = require("@socket.io/redis-adapter").createAdapter;
const MongoDBConnection = require('./config/database');
const RedisConnection = require('./config/cache');
const chatController = require("./controller/ChatController");

const mongoDB = new MongoDBConnection(process.env.MONGO_URI);
const redis = new RedisConnection(process.env.REDIS_URI);

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

(async () => {
  // MongoDB Connection
  await mongoDB.connect();

  // Redis Connection
  await redis.connect();
  const pubClient = redis.getPubClient();
  const subClient = redis.getSubClient();
  io.adapter(createAdapter(pubClient, subClient));
})();

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("joinRoom", (data) => chatController.onJoinRoom(socket, io, data));
  socket.on("chatMessage", (msg) => chatController.onChatMessage(socket, io, msg));
  socket.on("disconnect", () => chatController.onDisconnect(socket, io));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));