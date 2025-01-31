const Message = require('../models/Message');

class MessageService {
    async createMessage(username, room, text, time) {
        try {
            const message = new Message({ username, room, text, time });
            await message.save();
            return message;
        } catch (error) {
            throw new Error(`Failed to create message: ${error.message}`);
        }
    }

    async findMessage(room) {
        try {
            const messages = await Message.find({ room }).sort({ time: 1 });
            return messages;
        } catch (error) {
            throw new Error(`Failed to find messages: ${error.message}`);
        }
    }

    async deleteMessage(id) {
        try {
            await Message.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(`Failed to delete message: ${error.message}`);
        }
    }

    async updateMessage(id, text) {
        try {
            const message = await Message.findByIdAndUpdate(id, { text }, { new: true });
            return message;
        } catch (error) {
            throw new Error(`Failed to update message: ${error.message}`);
        }
    }
}

module.exports = new MessageService();