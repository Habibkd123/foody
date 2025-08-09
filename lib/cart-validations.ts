import { z } from 'zod';

// Cart item schema
export const cartItemSchema = z.object({
  product: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID format'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(100, 'Maximum quantity is 100'),
});

export const createCartSchema = z.object({
  user: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
  items: z.array(cartItemSchema).min(1, 'Cart must have at least one item'),
});

export const updateCartSchema = z.object({
  items: z.array(cartItemSchema).optional(),
});

export const addToCartSchema = z.object({
  productId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID format'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(100, 'Maximum quantity is 100'),
});

export const updateCartItemSchema = z.object({
  productId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID format'),
  quantity: z.number().int().min(0, 'Quantity cannot be negative').max(100, 'Maximum quantity is 100'),
});

export const cartQuerySchema = z.object({
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
  user: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format').optional(),
  hasItems: z.string().transform(val => val === 'true').optional(),
  minAmount: z.string().transform(Number).optional(),
  maxAmount: z.string().transform(Number).optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'totalAmount']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const cartIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid cart ID format'),
});

export const userIdSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
});

export const cartStatsQuerySchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format').optional(),
});

export const bulkCartItemSchema = z.object({
  productId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID format'),
  quantity: z.number().int().min(0, 'Quantity cannot be negative').max(100, 'Maximum quantity is 100'),
});

export const bulkUpdateCartSchema = z.object({
  items: z.array(bulkCartItemSchema).max(50, 'Maximum 50 items can be updated at once'),
});