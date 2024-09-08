// const request = require("supertest");
// const app = require("../server"); // Assuming server.js is exported

import app from "../server.js";
import request from "supertest";

describe("Express Server", () => {
  it("should serve the chat app's HTML page", (done) => {
    request(app)
      .get("/") // Requesting the root route (index.html)
      .expect("Content-Type", /html/)
      .expect(200, done);
  });

  it("should serve the static JS file (Socket.IO client)", (done) => {
    request(app)
      .get("/socket.io/socket.io.js") // Requesting the Socket.IO client file
      .expect("Content-Type", /javascript/)
      .expect(200, done);
  });
});
