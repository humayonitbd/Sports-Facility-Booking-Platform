
import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { User } from '../modules/user/user.model';
import catchAsync from '../utils/catchAsync';
import { USER_ROLE } from '../modules/user/user.constant';
import { AppError } from '../error/AppError';


export const AuthValidation = (...requiredRoles: (keyof typeof USER_ROLE)[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError(401, 'You are not authorized to access this route');
    }
    const accessToken = authHeader.split(' ')[1];
    const verfiedToken = jwt.verify(
      accessToken as string,
      config.jwt_access_secret as string,
    );

    const { role, email } = verfiedToken as JwtPayload;

    const user = await User.isUserExists( email );

    if (!user) {
      throw new AppError(401, 'User not found');
    }


    if (user?.role !== role) {
      throw new AppError(401, 'You are not authorized to access this route');
    }



    if (!requiredRoles.includes(role)) {
      throw new AppError(401, 'You are not authorized to access this route');
    }

    next();
  });
};
