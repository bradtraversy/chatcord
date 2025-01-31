const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    username: {
        type: String, 
        ref: 'User'
    },
    room:{
        type: String, 
        ref: 'User'
    },
    text: {type: String},
    time: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model("Message", MessageSchema);