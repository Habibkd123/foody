import prisma from "./db";
import axios from "axios";

const MAPBOX_MATRIX_URL = "https://api.mapbox.com/directions-matrix/v1/mapbox/driving";

async function etaSeconds(from: [number, number], to: [number, number]) {
  const coords = `${from[0]},${from[1]};${to[0]},${to[1]}`;
  const { data } = await axios.get(`${MAPBOX_MATRIX_URL}/${coords}`, {
    params: { access_token: process.env.MAPBOX_SERVER_TOKEN },
  });
  return data.durations?.[0]?.[1] ?? 9_999;
}

export async function runDispatchCycle() {
  const orders = await prisma.order.findMany({ where: { status: "pending" } });
  const drivers = await prisma.driver.findMany({ where: { status: "online" } });

  for (const order of orders) {
    const ranked = await Promise.all(
      drivers.map(async (d) => ({
        driver: d,
        eta: await etaSeconds(
          [d.lng, d.lat],
          [order.address.lng, order.address.lat],
        ),
      }))
    );

    ranked.sort((a, b) => a.eta - b.eta);
    const candidate = ranked[0];
    if (!candidate) continue;

    await prisma.order.update({
      where: { id: order.id },
      data: { driverId: candidate.driver.id, status: "assigned" },
    });

    globalThis.io?.to(candidate.driver.socketRoom).emit("order-assigned", order);
    globalThis.io?.to(`order-${order.id}`).emit("status", "assigned");
  }
}
