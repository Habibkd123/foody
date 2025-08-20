import { z } from 'zod';


export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  sku: z.string().optional(),
  description: z.string().optional(),
  images: z.array(z.string().url('Invalid image URL')).optional().default([]),
  price: z.number().positive('Price must be positive'),
  category: z.string().min(1, 'Category is required'), // ObjectId as string
  stock: z.number().int().min(0, 'Stock must be non-negative'),
  status: z.enum(['active', 'inactive', 'draft']).default('active'),
  brand: z.string().optional(),
  weight: z.string().optional(),
  dimensions: z.string().optional(),
  tags: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  specifications: z.record(z.string(), z.string()).optional(),
  nutritionalInfo: z.record(z.string(), z.string()).optional(),
  deliveryInfo: z.object({
    freeDelivery: z.boolean().optional(),
    estimatedDays: z.string().optional(),
    expressAvailable: z.boolean().optional(),
    expressDays: z.string().optional(),
  }).optional(),
  warranty: z.string().optional(),
  warrantyPeriod: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  totalReviews: z.number().int().min(0).optional(),
});


export const updateProductSchema = createProductSchema.partial();

export const querySchema = z.object({
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
  status: z.enum(['active', 'inactive']).optional(),
  category: z.string().optional(),
  search: z.string().optional(),
});

export const idParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format'),
});

export const searchQuerySchema = z.object({
  q: z.string().min(2, 'Search query must be at least 2 characters'),
  limit: z.string().transform(val => Math.min(Number(val) || 10, 50)).optional(),
});