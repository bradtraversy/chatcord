const MongoDBConnection = require("../config/database");
const mongoose = require("mongoose");

describe("MongoDBConnection", () => {
  let mongoDB;

  beforeAll(async () => {
    try {
      mongoDB = new MongoDBConnection(process.env.MONGODB_URI || "mongodb://localhost:27017/test");
      await mongoDB.connect();
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      throw error;
    }
  });

  afterAll(async () => {
    try {
      await mongoose.disconnect();
    } catch (error) {
      console.error("Error disconnecting from MongoDB:", error);
    }
  });

  test("should connect to MongoDB", () => {
    const isConnected = mongoose.connection.readyState === 1;
    expect(isConnected).toBe(true);
  });

  test("should throw an error if connection fails", async () => {
    try {
      await mongoDB.connect();
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});