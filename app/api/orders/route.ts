// import { createZodRoute } from "next-zod-route";
// import { orderSchema } from "@/lib/validation";
// import prisma from "@/lib/db";

// export const POST = createZodRoute()
//   .body(orderSchema)
//   .handler(async (_req, ctx) => {
//     const data = ctx.body;
//     const order = await prisma.order.create({ data: { ...data, status: "pending" } });
//     return { id: order.id, status: order.status };
//   });
