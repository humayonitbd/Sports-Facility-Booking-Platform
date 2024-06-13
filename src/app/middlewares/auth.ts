
import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { User } from '../modules/user/user.model';
import catchAsync from '../utils/catchAsync';
import { USER_ROLE } from '../modules/user/user.constant';
import { AppError } from '../error/AppError';
import { AuthError } from '../error/AuthError';


export const AuthValidation = (...requiredRoles: (keyof typeof USER_ROLE)[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // throw new AppError(401, 'You are not authorized to access this route');
      return res.status(401).json(AuthError());
    }
    const accessToken = authHeader.split(' ')[1];
    const verfiedToken = jwt.verify(
      accessToken as string,
      config.jwt_access_secret as string,
    );

    const { role, email, userId } = verfiedToken as JwtPayload;
    console.log('userId', userId,"role",role,'email',email);

    const userExist = await User.isUserExistsByEmail( email );

    if (!userExist) {
      throw new AppError(401, 'You are not authorized to access this route');
    }

      const userExistById = await User.isUserExistsByid(userId);
      if (!userExistById) {
        throw new AppError(401, 'You are not authorized to access this route');
      }

   
    if (userExist?.role !== role) {
      throw new AppError(401, 'You are not authorized to access this route');
    }



    if (!requiredRoles.includes(role)) {
      throw new AppError(401, 'You are not authorized to access this route');
    }

    req.user = verfiedToken as JwtPayload;
    next();
  });
};
