const messageHandler = (socket, io) => {
  socket.on("message", (data) => {
    console.log("message", data);
    data.success = true;
    socket.to("room-" + data.to).emit("message", data);
    socket.emit("message", data);
    console.log("dataTo",data);
    // socket.broadcast.emit("message",data)
  });
};
module.exports = { messageHandler };
