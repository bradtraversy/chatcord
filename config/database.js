const mongoose = require("mongoose");

const dbString = process.env.DB_STRING || "mongodb://localhost:27017/ChatCord";

mongoose.connect(dbString).catch(err => console.error(err));;

mongoose.connection.on("connected", function() {
    console.log(`[INFO] Connected to ${dbString}`);
});

mongoose.connection.on("error", function(error) {
    console.log(`[INFO] Connection to ${dbString} failed: ${error}`);
});

mongoose.connection.on("disconnected", function() {
    console.log(`[INFO] Disconnected from ${dbString}`);
});

process.on("SIGINT", function() {
    mongoose.connection.close(function() {
        console.log(`[INFO] Disconnected from ${dbString} through app termination`);
        process.exit(0);
    });
});