
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TUser } from '../user/user.interface';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import jwt from 'jsonwebtoken';
import config from '../../config';

const signupService = async (payload: TUser): Promise<any> => {
  //user existence check
  const user = await User.findOne({ email: payload.email });

  if (user) {
    throw new Error('User already exists');
  }
  //create user
  const newUser = await User.create(payload);

  return newUser;
};

const loginService = async (payload: TLoginUser) => {
//   const user = await User.findOne({ email: payload.email }).select('+password');

//   if (!user) {
//     throw new Error('User not found');
//   }

//   if (user.status === 'BLOCKED') {
//     throw new Error('User is blocked');
//   }

//   const passwordMatch = await isPasswordMatched(
//     payload.password,
//     user.password,
//   );

//   if (!passwordMatch) {
//     throw new Error('Password not matched');
//   }

//   const jwtPayload = {
//     email: user.email,
//     role: user.role,
//   };

//   const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
//     expiresIn: config.jwt_access_expires_in,
//   });

//   const refreshToken = jwt.sign(
//     jwtPayload,
//     config.jwt_refresh_secret as string,
//     {
//       expiresIn: config.jwt_refresh_expires_in,
//     },
//   );

//   return {
//     accessToken,
//     refreshToken,
//   };
};

export const AuthServices = {
  signupService,
  loginService,
};
