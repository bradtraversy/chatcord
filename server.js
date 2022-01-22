const path = require('path');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server);

// set static folder 
app.use(express.static(path.join(__dirname,'public')));

//Run when client connects
io.on('connection', (socket) => {
    console.log('New WS connection...');
});

const PORT = 3000 || process.env.PORT;

app.listen(PORT, () => console.log(`server running on ${PORT}`));