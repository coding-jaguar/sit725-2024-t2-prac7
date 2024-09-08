import { expect } from "chai";
import { io } from "socket.io-client";
import http from "http";
import { Server as ioBack } from "socket.io"; // Renaming 'Server' to 'ioBack' for clarity
import app from "../server.js"; // Assuming server.js exports the Express app

describe("Socket.IO Server", () => {
  let server, clientSocket, ioServer;

  // Before each test, set up a new server and a new client connection
  beforeEach((done) => {
    const httpServer = http.createServer(app);
    ioServer = new ioBack(httpServer);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = io(`http://localhost:${port}`);
      ioServer.on("connection", (socket) => {
        socket.on("chat message", (msg) => {
          ioServer.emit("chat message", msg); // Broadcast the message
        });
      });
      clientSocket.on("connect", done); // Wait for the client to connect
    });
  });

  // After each test, close the server and the socket connection
  afterEach(() => {
    ioServer.close();
    clientSocket.close();
  });

  it("should connect to the server", (done) => {
    expect(clientSocket.connected).to.be.true;
    done();
  });

  it("should broadcast messages to all clients", (done) => {
    const testMessage = "Hello, world!";
    clientSocket.emit("chat message", testMessage);

    clientSocket.on("chat message", (msg) => {
      expect(msg).to.equal(testMessage);
      done();
    });
  });

  it("should disconnect from the server", (done) => {
    clientSocket.on("disconnect", () => {
      expect(clientSocket.connected).to.be.false;
      done();
    });
    clientSocket.disconnect();
  });
});
