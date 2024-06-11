
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TUser } from '../user/user.interface';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import config from '../../config';
import { AppError } from '../../error/AppError';
import httpStatus from 'http-status';
import { createToken } from './auth.utils';

const signupService = async (payload: TUser): Promise<any> => {
  //user existence check
  const user = await User.isUserExists(payload?.email);

  if (user) {
    throw new Error('User already exists');
  }
  //create user
  const newUser = await User.create(payload);

  return newUser;
};

const loginService = async (payload: TLoginUser) => {
  const user = await User.findOne( {email: payload?.email} ).select('+password');
  
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!!');
  }
  // // checking if the password is correct
  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched !!');
  }

  const userData = await User.isUserExists(payload?.email);

  const jwtPayload = {
    email: user?.email || "",
    role: user?.role || "",
  };
  // create access token and send client
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  // create refresh token and send client
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

 

  return {
    accessToken,
    refreshToken,
    userData,
  };
};

export const AuthServices = {
  signupService,
  loginService,
};
