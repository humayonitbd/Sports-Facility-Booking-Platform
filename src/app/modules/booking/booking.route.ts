import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { BookingValidation } from './booking.validation';
import { BookingControllers } from './booking.controller';
import { AuthValidation } from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';



const router = express.Router();

router.post(
  '',
  AuthValidation(USER_ROLE.user),
  validateRequest(BookingValidation.createBookingSchema),
  BookingControllers.createBooking,
);
router.get('', AuthValidation(USER_ROLE.admin), BookingControllers.getAllBooking);
// router.get(
//   '/user',
//   BookingControllers.updateFacility,
// );
router.delete('/:id', BookingControllers.deleteBooking);

export const BookingRoutes = router;
