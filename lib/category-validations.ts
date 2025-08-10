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
export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name too long'),
  parent: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid parent ID format').optional().nullable(),
  image: relativeOrAbsoluteUrl.optional(),
  description: z.string().max(500, 'Description too long').optional(),
  status: z.enum(['active', 'inactive']).optional(),
  slug: z.string().max(100, 'Slug too long').optional(),

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