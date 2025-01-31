const { createClient } = require('redis');

class RedisConnection {
  constructor(url) {
    this.url = url;
    this.pubClientt = null;
    this.subClient = null;
  }

  async connect() {
    try {
      this.pubClient = createClient({ url: this.url });
      await this.pubClient.connect();
      console.log("Redis PubClient connected successfully!");

      this.subClient = this.pubClient.duplicate();
      await this.subClient.connect();
      console.log("Redis Subclient connected successfully!");

    } catch (error) {
      console.error("Redis connection error:", error);
    }
  }

  getPubClient() {
    return this.pubClient;
  }


  getSubClient() {
    return this.subClient;
  }

  async set(key, value, expirationInSeconds = null) {
    try {
      if (expirationInSeconds) {
        await this.pubClient.set(key, value, { EX: expirationInSeconds });
      } else {
        await this.pubClient.set(key, value);
      }
      console.log(`Key "${key}" set in Redis successfully!`);
    } catch (error) {
      console.error(`Failed to set key "${key}" in Redis:`, error);
    }
  }

  async get(key) {
    try {
      const value = await this.pubClient.get(key);
      console.log(`Key "${key}" retrieved from Redis successfully!`);
      return value;
    } catch (error) {
      console.error(`Failed to get key "${key}" from Redis:`, error);
    }
  }

  async del(key) {
    try {
      await this.pubClient.del(key);
      console.log(`Key "${key}" deleted from Redis successfully!`);
    } catch (error) {
      console.error(`Failed to delete key "${key}" from Redis:`, error);
    }
  }

  async disconnect() {
    try {
      if (this.pubClient) {
        await this.pubClient.disconnect();
        console.log("Redis PubClient disconnected successfully!");
      }
      if (this.subClient) {
        await this.subClient.disconnect();
        console.log("Redis SubClient disconnected successfully!");
      }
    } catch (error) {
      console.error("Error disconnecting Redis clients:", error);
    }
  }

}

module.exports = RedisConnection;