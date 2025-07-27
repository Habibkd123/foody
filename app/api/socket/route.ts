import { Server as IOServer } from "socket.io";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  // Needed so Vercel Edge doesn’t swallow the upgrade
  return NextResponse.json({ ok: true });
}

// Hack: Next.js exposes the Node HTTP server on res.socket in Pages router.
// In App router we rely on a global.
declare global {
  // eslint-disable-next-line no-var
  var io: IOServer | undefined;
}

export const config = { runtime: "nodejs" };

export default function handler(req: any, res: any) {
  if (!global.io) {
    global.io = new IOServer(res.socket.server, {
      path: "/api/socket",
      cors: { origin: "*" },
    });
    global.io.on("connection", (socket) => {
      socket.on("join-order", (id: string) => socket.join(`order-${id}`));
      socket.on("driver-location", (payload) => {
        socket.to(`order-${payload.orderId}`).emit("driver-location", payload);
      });
    });
  }
  res.end();
}
