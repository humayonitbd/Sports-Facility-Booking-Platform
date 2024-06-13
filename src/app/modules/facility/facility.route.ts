import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { FacilityValidation } from './facility.validation';
import { FacilityControllers } from './facility.controller';
import { AuthValidation } from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
  '/facility',
  AuthValidation(USER_ROLE.admin),
  validateRequest(FacilityValidation.createFacilitySchema),
  FacilityControllers.createFacility,
);
router.get(
  '/facilities',
  FacilityControllers.getAllFacility,
);
router.put(
  '/facility/:id',
  AuthValidation(USER_ROLE.admin),
  validateRequest(FacilityValidation.updateFacilitySchema),
  FacilityControllers.updateFacility,
);
router.delete(
  '/facility/:id',
  AuthValidation(USER_ROLE.admin),
  FacilityControllers.deleteFacility,
);

export const FacilityRoutes = router;
