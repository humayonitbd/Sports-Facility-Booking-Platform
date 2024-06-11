import express from 'express';
import { authControllers } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from '../user/user.validation';
import { AuthValidation } from './auth.validation';


const router = express.Router();

router.post('/signup', validateRequest(UserValidation.createUserSchema), authControllers.signupUser);
router.post('/login', validateRequest(AuthValidation.loginSchema), authControllers.loginUser);

export const AuthRoutes = router;
