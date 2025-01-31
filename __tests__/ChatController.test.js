const chatController = require("../controller/ChatController");
const MessageService = require("../services/MessageService");
const UserService = require("../services/UserService");

jest.mock("../services/MessageService");
jest.mock("../services/UserService");

describe("ChatController", () => {
  let socketMock;
  let ioMock;

  beforeEach(() => {
    socketMock = { id: "socket-id", join: jest.fn(), emit: jest.fn(), disconnect: jest.fn() };
    ioMock = { to: jest.fn().mockReturnThis(), emit: jest.fn() };

    UserService.userJoin.mockResolvedValue({ id: "socket-id", username: "JohnDoe", room: "General" });
    MessageService.findMessage.mockResolvedValue([
      { username: "JohnDoe", text: "Hello, world!", room: "General" },
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should handle a user joining a room", async () => {
    await chatController.onJoinRoom(socketMock, ioMock, { username: "JohnDoe", room: "General" });

    expect(socketMock.join).toHaveBeenCalledTimes(1);
    expect(socketMock.join).toHaveBeenCalledWith("General");
    expect(socketMock.emit).toHaveBeenCalledTimes(1);
    expect(socketMock.emit).toHaveBeenCalledWith(
      "message",
      expect.objectContaining({ username: "ChatCord Bot", text: "Welcome to ChatCord!" })
    );
    expect(ioMock.to).toHaveBeenCalledTimes(1);
    expect(ioMock.to).toHaveBeenCalledWith("General");
  });

  test("should handle sending chat messages", async () => {
    UserService.getCurrentUser.mockResolvedValue({ username: "JohnDoe", room: "General" });

    await chatController.onChatMessage(socketMock, ioMock, "Hello, everyone!");

    expect(ioMock.to).toHaveBeenCalledTimes(1);
    expect(ioMock.to).toHaveBeenCalledWith("General");
    expect(ioMock.emit).toHaveBeenCalledTimes(1);
    expect(ioMock.emit).toHaveBeenCalledWith(
      "message",
      expect.objectContaining({ username: "JohnDoe", text: "Hello, everyone!" })
    );
  });

  test("should handle user disconnection", async () => {
    await chatController.onDisconnect(socketMock, ioMock);

    expect(socketMock.disconnect).toHaveBeenCalledTimes(1);
  });
});