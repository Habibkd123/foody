import { Server as IOServer } from "socket.io";
import { NextResponse } from "next/server";

declare global {
  // Global is like a singleton
  var io: IOServer | undefined;
}

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ ok: true, message: "Socket.io endpoint running" });
}

export async function POST() {
  if (!global.io) {
    const io = new IOServer({
      cors: { origin: "*" },
    });
    global.io = io;

    io.on("connection", (socket) => {
      console.log("Socket connected:", socket.id);
      socket.on("message", (msg) => {
        io.emit("message", msg);
      });
      socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
      });
    });
  }

  return NextResponse.json({ message: "Socket.io server initialized" });
}
