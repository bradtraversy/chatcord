const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema(
    {
        text: { type: String, required: true },
        username: { type: String, required: true },
        room: { type: String, required: true },
        date: { type: Date, required: true }
    }
);
module.exports = mongoose.model("Message", messageSchema);
