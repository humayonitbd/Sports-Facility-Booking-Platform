import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { User } from '../modules/user/user.model';
import catchAsync from '../utils/catchAsync';
import { USER_ROLE } from '../modules/user/user.constant';
import { AuthError } from '../error/AuthError';

export const AuthValidation = (
  ...requiredRoles: (keyof typeof USER_ROLE)[]
) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(AuthError());
    }
    const accessToken = authHeader.split(' ')[1];
    const verfiedToken = jwt.verify(
      accessToken as string,
      config.jwt_access_secret as string,
    );

    const { role, email, userId } = verfiedToken as JwtPayload;
    console.log('userId', userId, 'role', role, 'email', email);

    const userExist = await User.isUserExistsByEmail(email);

    if (!userExist) {
      return res.status(401).json(AuthError());
    }

    const userExistById = await User.isUserExistsByid(userId);
    if (!userExistById) {
      return res.status(401).json(AuthError());
    }

    if (userExist?.role !== role) {
      return res.status(401).json(AuthError());
    }

    if (!requiredRoles.includes(role)) {
      return res.status(401).json(AuthError());
    }

    req.user = verfiedToken as JwtPayload;
    next();
  });
};
