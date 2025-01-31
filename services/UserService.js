const User = require('../models/User')

module.exports = new class UserService {
    
    async userJoin(socketId, username, room) {
        const user = new User({ socketId, username, room });
        try {
            await user.save();
            return user;
        } catch (error) {
            throw new Error(`Failed to join user: ${error.message}`);
        }
    }

    async getCurrentUser(socketId) {
        try {
            return await User.findOne({ socketId });
        } catch (error) {
            throw new Error(`Failed to get current user: ${error.message}`);
        }
    }

    async userLeave(socketId) {
        try {
            return await User.findOneAndDelete({ socketId });
        } catch (error) {
            throw new Error(`Failed to leave user: ${error.message}`);
        }
    }

    async getRoomUsers(room) {
        try {
            return await User.find({ room });
        } catch (error) {
            throw new Error(`Failed to get user room: ${error.message}`);
        }
    }
}