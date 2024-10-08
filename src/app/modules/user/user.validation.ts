import { z } from 'zod';
import { USER_ROLE, USER_STATUS } from './user.constant';

export const createUserSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email address'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters long'),
    phone: z.string().min(1, 'Phone is required'),
    role: z.nativeEnum(USER_ROLE).default(USER_ROLE.user).optional(),
    address: z.string().min(1, 'Address is required'),
    profileImg: z.string().min(1, 'Profile image is required'),
    status: z
      .nativeEnum(USER_STATUS)
      .default(USER_STATUS.IN_PROGRESS)
      .optional(),
  }),
});

export const UserValidation = {
  createUserSchema,
};
