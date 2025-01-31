const formatMessage = require('../utils/messages');
const userService = require('../services/UserService');
const messageService = require('../services/MessageService');

class ChatController {
    /**
     * 
     * @param {*} socket 
     * @param {*} io 
     * @param {*} user 
     */
    async onJoinRoom(socket, io, { username, room }) {
        try {
            const user = await userService.userJoin(socket.id, username, room);
            socket.join(user.room);

            // Welcome chat message
            socket.emit("message", formatMessage("ChatCord Bot", "Welcome to ChatCord!"));

            const messages = await messageService.findMessage(room);
            messages.forEach((message) => 
                socket.emit("message", formatMessage(message.username, message.text))
            );

            // Notify the other users
            socket.broadcast.to(user.room).emit("message", formatMessage("ChatCord Bot", `${user.username} has joined the chat`));
            io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: await userService.getRoomUsers(user.room)
            });
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * 
     * @param {*} socket 
     * @param {*} io 
     * @param {*} msg 
     */
    async onChatMessage(socket, io, msg) {
        try {
            const user = await userService.getCurrentUser(socket.id);
            if (!user) return;

            const message = await messageService.createMessage(user.username, user.room, msg);
            io.to(user.room).emit("message", formatMessage(user.username, message.text));

        } catch (error) {
            console.error(error);
        }
    }

    /**
     * 
     * @param {*} socket 
     * @param {*} io 
     */
    async onDisconnect(socket, io) {
        try {
            const user = await userService.getCurrentUser(socket.id);
            if (user) {
                io.to(user.room).emit("message", formatMessage("ChatCord Bot", `${user.username} has left the chat`));
                io.to(user.room).emit("roomUsers", {
                    room: user.room,
                    users: await userService.getRoomUsers(user.room),
                });
            }

            await userService.userLeave(socket.id);
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = new ChatController();