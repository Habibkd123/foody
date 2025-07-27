import { z } from "zod";
export const orderSchema = z.object({
  address: z.object({
    label: z.string().min(5),
    lat: z.number().finite(),
    lng: z.number().finite(),
  }),
  items: z.array(
    z.object({
      id: z.number().positive(),
      name: z.string(),
      price: z.number().positive(),
      quantity: z.number().int().positive(),
    })
  ).nonempty(),
  tip: z.number().min(0).max(1_000),
  note: z.string().max(240).optional(),
});
export type OrderDTO = z.infer<typeof orderSchema>;
