import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { FacilityValidation } from './facility.validation';
import { FacilityControllers } from './facility.controller';
import { AuthValidation } from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
  '',
  AuthValidation(USER_ROLE.admin),
  validateRequest(FacilityValidation.createFacilitySchema),
  FacilityControllers.createFacility,
);
router.get('', FacilityControllers.getAllFacility);
router.put(
  '/:id',
  AuthValidation(USER_ROLE.admin),
  validateRequest(FacilityValidation.updateFacilitySchema),
  FacilityControllers.updateFacility,
);
router.delete(
  '/:id',
  AuthValidation(USER_ROLE.admin),
  FacilityControllers.deleteFacility,
);

export const FacilityRoutes = router;
