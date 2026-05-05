import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(128),
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export const transactionSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(['income', 'expense']),
  category: z.string().trim().min(1).max(50),
  date: z.string().datetime().or(z.string().min(1)),
  notes: z.string().max(500).optional().default(''),
});

export const budgetSchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/),
  amount: z.number().nonnegative(),
});

export const recurringSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(['income', 'expense']),
  category: z.string().trim().min(1).max(50),
  frequency: z.enum(['daily', 'weekly', 'monthly']),
  startDate: z.string().min(1),
  notes: z.string().max(500).optional().default(''),
});
