import { z } from 'zod';

export const CreateUserSchema = z.object({
    username: z.string().min(1, { message: 'Username not provided' }),
    email: z.string().min(1, { message: 'Email not provided' }).email({ message: 'Invalid email address' }),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
