const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
    {
        clientId: { type: String, required: true },
        username: { type: String, required: true },
        room: { type: String, required: true }
    }
);
module.exports = mongoose.model("Active User", userSchema);
