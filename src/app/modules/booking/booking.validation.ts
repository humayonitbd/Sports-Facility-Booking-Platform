import { z } from 'zod';
import { BOOKING_STATUS } from './booking.constant';

const timeStringSchema = z.string().refine(
  (time) => {
    const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(time);
  },
  { message: "invalid time formate, expected 'HH:MM' in 24 hour format" },
);

export const createBookingSchema = z.object({
  body: z.object({
   date: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
    startTime: timeStringSchema,
    endTime: timeStringSchema,
    user: z.string().optional(),
    facility: z.string(),
    payableAmount: z
      .number()
      .min(0, 'Payable amount must be a non-negative number').optional(),
    isBooked: z.nativeEnum(BOOKING_STATUS, { message: 'Invalid booking status' }).optional(),
  }).refine((body) => {
        const start = new Date(`1980-01-01T${body.startTime}:00`);
        const end = new Date(`1980-01-01T${body.endTime}:00`);
        return end > start;
      },
      { message: 'Start time should be before End time. format:"00:00" !!' },
    ),
});

export const BookingValidation = {
  createBookingSchema,
};
