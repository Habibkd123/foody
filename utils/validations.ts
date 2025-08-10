import { z } from 'zod';
const relativeOrAbsoluteUrl = z.string().refine((val) => {
  try {
    // Try parsing as a URL, if fails check if relative path
    new URL(val);
    return true; // valid full URL
  } catch {
    // Allow if it starts with '/' (relative path)
    return val.startsWith('/');
  }
}, {
  message: 'Invalid image URL or relative path',
})
export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  description: z.string().optional(),
  images: z.array(relativeOrAbsoluteUrl).min(1, 'At least one image is required').max(5, 'Maximum 5 images allowed'),
  price: z.number().positive('Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  stock: z.number().int().min(0, 'Stock must be non-negative'),
  status: z.enum(['active', 'inactive']).optional(),
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