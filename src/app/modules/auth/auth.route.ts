import express from 'express';
import { authControllers } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from '../user/user.validation';
import { AuthValidationSchema } from './auth.validation';
import { AuthValidation } from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
  '/signup',
  validateRequest(UserValidation.createUserSchema),
  authControllers.signupUser,
);
router.post(
  '/login',
  validateRequest(AuthValidationSchema.loginSchema),
  authControllers.loginUser,
);


router.post(
  '/refresh-token',
  validateRequest(AuthValidationSchema.refreshTokenValidationSchema),
  authControllers.refreshTokenController,
  );
  
router.get('/user/:id', AuthValidation(USER_ROLE.user, USER_ROLE.admin), authControllers.userGet);
router.get(
  '/all-users',
  AuthValidation(USER_ROLE.admin),
  authControllers.getAllUsers,
);


export const AuthRoutes = router;
