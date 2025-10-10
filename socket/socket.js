// import express from "express";
// import { Server } from "socket.io";
// import http from "http";

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "hhtp://localhost:5173",
//     credentials: true,
//   },
// });

// // server.listen(3001, () => {
// //   console.log("Socket server is running on port 3001"); hhtp://localhost:5173
// // });

// io.on("connection", (socket) => {
//   console.log("A user connected:", socket.id);

//   socket.on("join project", (projectId) => {
//     if (!projectId) return console.error("Invalid projectId");
//     socket.join(projectId);
//     console.log(`User ${socket.id} joined project: ${projectId}`);
//   });

//   socket.on("new message", ({ projectId, sender, message }) => {
//     if (!projectId || !sender || !message)
//       return console.error(
//         "Missing data for new message",
//         projectId,
//         sender,
//         message
//       );

//     console.log("New message:", projectId, sender, message);

//     io.in(projectId).emit("received message", {
//       sender: sender,
//       message: message,
//     });
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });

// export { app, server, io };
