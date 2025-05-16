import {z} from 'zod'

export const userSchema = z.object({
  firstName: z.string().min(3).max(30).trim(),
  lastName: z.string().min(3).max(30).trim().optional(),
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(5) 
});

