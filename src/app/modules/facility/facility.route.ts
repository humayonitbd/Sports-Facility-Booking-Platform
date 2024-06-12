import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { FacilityValidation } from './facility.validation';
import { FacilityControllers } from './facility.controller';

const router = express.Router();

router.post(
  '/facility',
  validateRequest(FacilityValidation.createFacilitySchema),
  FacilityControllers.createFacility,
);
router.get(
  '/facilities',
  FacilityControllers.getAllFacility,
);
router.put(
  '/facility/:id',
  validateRequest(FacilityValidation.updateFacilitySchema),
  FacilityControllers.updateFacility,
);
router.delete(
  '/facility/:id',
  FacilityControllers.deleteFacility,
);

export const FacilityRoutes = router;
