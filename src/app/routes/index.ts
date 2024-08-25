import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { FacilityRoutes } from '../modules/facility/facility.route';
import { BookingRoutes } from '../modules/booking/booking.route';
import { paymentRoute } from '../modules/payment/payment.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/facility',
    route: FacilityRoutes,
  },
  {
    path: '',
    route: BookingRoutes,
  },
  {
    path: '',
    route: paymentRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
