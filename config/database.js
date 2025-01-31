const mongoose = require("mongoose");

class MongoDBConnection {
  constructor(uri) {
    this.uri = uri;
  }

  async connect() {
    if (!this.uri) {
      throw new Error("MongoDB URI is undefined. Check your .env file.");
    }

    try {
      await mongoose.connect(this.uri);
      console.log("MongoDB connected successfully!");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error.message);
      // Implement retry logic
      setTimeout(() => this.connect(), 5000); // Retry in 5 seconds
    }
  }
}

module.exports = MongoDBConnection;
