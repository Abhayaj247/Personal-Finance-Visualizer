import * as z from 'zod';

export const TransactionSchema = z.object({
  amount: z.coerce.number()
    .min(0.01, "Amount must be at least 0.01")
    .refine(val => !isNaN(val), {
      message: "Amount must be a valid number",
    }),
  date: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date",
  }),
  description: z.string()
    .min(3, "Description must be at least 3 characters")
    .max(100, "Description cannot exceed 100 characters"),
  category: z.string().min(1, { message: 'Category is required' })
});

export type TransactionFormValues = z.infer<typeof TransactionSchema>;

export const BudgetSchema = z.object({
  category: z.string().nonempty("Category is required"),
  amount: z.number().min(0, "Amount must be greater than or equal to zero"),
});

export type BudgetFormValues = z.infer<typeof BudgetSchema>;