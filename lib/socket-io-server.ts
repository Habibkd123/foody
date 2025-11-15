import { Server as IOServer } from "socket.io";
import type { Server as HTTPServer } from "http";

declare global {
  var io: IOServer | undefined;
}

export function initializeSocketIO(httpServer: HTTPServer) {
  if (!global.io) {
    global.io = new IOServer(httpServer, {
      path: "/api/socket",
      cors: { origin: "*" },
    });

    global.io.on("connection", (socket) => {
      console.log("User connected:", socket.id);
      
      socket.on("join-order", (id: string) => {
        socket.join(`order-${id}`);
        console.log(`User joined order-${id}`);
      });

      socket.on("driver-location", (payload) => {
        socket.to(`order-${payload.orderId}`).emit("driver-location", payload);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });
  }

  return global.io;
}
