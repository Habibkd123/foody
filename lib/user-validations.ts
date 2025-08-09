import { z } from 'zod';

// Address schema
export const addressSchema = z.object({
  street: z.string().min(1, 'Street is required').max(100, 'Street too long'),
  city: z.string().min(1, 'City is required').max(50, 'City name too long'),
  state: z.string().min(1, 'State is required').max(50, 'State name too long'),
  postalCode: z.string().min(3, 'Postal code too short').max(20, 'Postal code too long'),
  country: z.string().min(1, 'Country is required').max(50, 'Country name too long'),
});

export const createUserSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username too long').optional(),
  firstName: z.string().min(1, 'First name is required').max(30, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(30, 'Last name too long'),
  email: z.string().email('Invalid email format'),
  phone: z.number().int().positive('Phone number must be positive'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password too long'),
  role: z.enum(['user', 'admin']).optional(),
  addresses: z.array(addressSchema).optional(),
});

export const updateUserSchema = createUserSchema.partial().extend({
  password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password too long').optional(),
});

export const userQuerySchema = z.object({
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
  role: z.enum(['user', 'admin']).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['firstName', 'lastName', 'email', 'createdAt', 'updatedAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  hasAddresses: z.string().transform(val => val === 'true').optional(),
});

export const userIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters').max(100, 'Password too long'),
  confirmPassword: z.string().min(1, 'Confirm password is required'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const addAddressSchema = addressSchema;

export const updateAddressSchema = addressSchema.partial();

export const userStatsQuerySchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});