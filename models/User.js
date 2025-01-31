const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    socketId: {type: String},
    username: {type: String},
    room: {type: String},
    joinedAt: {
        type: Date,
        Default: Date.now,
    },
});

module.exports = mongoose.model("User", UserSchema);
