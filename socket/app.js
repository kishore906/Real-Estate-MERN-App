import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
});

let onlineUsers = [];

const addUser = (userId, socketId) => {
  const userExits = onlineUsers.find((user) => user.userId === userId);
  if (!userExits) {
    onlineUsers.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

// creating socket connection
io.on("connection", (socket) => {
  // console.log(socket, socket.id); // using socket.id we can send private messages
  // creating an event example
  //   socket.on("test", (data) => {
  //     // "test" is event name
  //     console.log(data);
  //   });

  socket.on("newUser", (userId) => {
    addUser(userId, socket.id); // here we are adding users (to whom the loggIn user messaged to) and socket.id for each chat
    console.log(onlineUsers);
  });

  // sending private messages
  socket.on("sendMessage", ({ receiverId, data }) => {
    // console.log(receiverId, data);
    const receiver = getUser(receiverId);
    console.log(receiver.socketId);
    io.to(receiver.socketId).emit("getMessage", data);
  });

  // when ever we close the browser tab we need to remove users from socket connection
  socket.on("disconnect", () => {
    removeUser(socket.id); // this function does removing of users
  });
});

// socket port
io.listen("4000");
