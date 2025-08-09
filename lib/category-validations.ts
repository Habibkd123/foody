import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name too long'),
  parent: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid parent ID format').optional().nullable(),
  image: z.string().url('Invalid image URL').optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export const categoryQuerySchema = z.object({
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
  parent: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid parent ID format').optional().nullable(),
  search: z.string().optional(),
  includeSubcategories: z.string().transform(val => val === 'true').optional(),
  level: z.string().transform(Number).optional(),
});

export const categoryIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID format'),
});

export const categoryTreeQuerySchema = z.object({
  maxLevel: z.string().transform(Number).optional(),
  parentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid parent ID format').optional().nullable(),
});