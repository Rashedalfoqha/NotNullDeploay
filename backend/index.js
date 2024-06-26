const express = require("express");
const { Server, Socket } = require("socket.io");
const { auth } = require("./middleware/authentication");
const { messageHandler } = require("./middleware/message");
const error = require("./middleware/error");
require("dotenv").config();
const app = express();
require("./models/db");
app.use(express.json());
const cors = require("cors");
app.use(cors());
const io = new Server(8080, { cors: { origin: "*" } });
io.use(auth);

const PORT = process.env.PORT || 5000;
const usersRouter = require("./routes/users");
const ticketRouter = require("./routes/tickets");
const workspaceRouter = require("./routes/workspace");

app.use("/tickets", ticketRouter);
app.use("/users", usersRouter);
app.use("/workspace", workspaceRouter);

app.listen(PORT, () => {
  console.log(`connecting server on ${PORT}`);
});


io.on("connection", (socket) => {
  console.log(socket.id);
  socket.use(error);
  console.log("connected");
  // socket.use((socket, next) => {});

  const user_id = socket.handshake.headers.user_id;
  client[user_id] = { socket_id: socket.id, user_id };
  console.log(client);
  socket.on("error", (error) => {
    socket.emit("error", { error: error.message });
  });

  messageHandler(socket, io);
  socket.on("disconnect", () => {
    console.log(socket.id); /*  */
    for (const key in client) {
      if (client[key].socket_id === socket.id) {
        delete client[key];
      }
    }
    console.log(client);
  });
});

