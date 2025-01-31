const RedisConnection = require("../config/cache");
const redisMock = require("redis-mock");

jest.mock("redis", () => redisMock);

describe("RedisConnection", () => {
  let redis;

  beforeAll(async () => {
    redis = new RedisConnection(process.env.REDIS_URI||"redis://localhost:6379");
    await redis.connect();
  });

  afterAll(async () => {
    await redis.disconnect();
  });

  test("should connect to Redis and return clients", async () => {
    const pubClient = await redis.getPubClient();
    const subClient = await redis.getSubClient();

    expect(pubClient).toBeDefined();
    expect(subClient).toBeDefined();
  });

  test("should handle connection error", async () => {
    jest.spyOn(redis, "connect").mockRejectedValueOnce(new Error("Connection error"));
    await expect(redis.connect()).rejects.toThrowError("Connection error");
  });

  test("should handle disconnection error", async () => {
    jest.spyOn(redis, "disconnect").mockRejectedValueOnce(new Error("Disconnection error"));
    await expect(redis.disconnect()).rejects.toThrowError("Disconnection error");
  });
});