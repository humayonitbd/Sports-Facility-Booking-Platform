import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { BookingValidation } from './booking.validation';
import { BookingControllers } from './booking.controller';
import { AuthValidation } from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
  '/bookings',
  AuthValidation(USER_ROLE.user),
  validateRequest(BookingValidation.createBookingSchema),
  BookingControllers.createBooking,
);
router.get(
  '/bookings/user',
  AuthValidation(USER_ROLE.user),
  BookingControllers.userGetBooking,
);

router.get(
  '/bookings',
  AuthValidation(USER_ROLE.admin),
  BookingControllers.getAllBooking,
);
router.get(
  '/bookings/:id',
  AuthValidation(USER_ROLE.admin, USER_ROLE.user),
  BookingControllers.getSingleBooking,
);
router.delete(
  '/bookings/:id',
  AuthValidation(USER_ROLE.user),
  BookingControllers.deleteBooking,
);

router.get('/check-availability', BookingControllers.AvailabilityBooking);

export const BookingRoutes = router;
