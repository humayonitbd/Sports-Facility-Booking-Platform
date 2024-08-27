/* eslint-disable @typescript-eslint/no-explicit-any */
import { TUser } from '../user/user.interface';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import config from '../../config';
import { AppError } from '../../error/AppError';
import httpStatus from 'http-status';
import { createToken, verifyToken } from './auth.utils';
import mongoose from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';
import QueryBuilder from '../../builder/QueryBuilder';

const signupService = async (payload: TUser): Promise<any> => {
  //user existence check
  const user = await User.isUserExistsByEmail(payload?.email);

  if (user) {
    throw new Error('User already exists');
  }

  const userPhone = await User.isUserExistsByNumber(payload?.phone);
  if (userPhone) {
    throw new Error('User Number already exists!');
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    //create user
    const newUser = await User.create([payload], { session });
    console.log('newUser', newUser);
    await session.commitTransaction();
    await session.endSession();
    return newUser[0];
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

const loginService = async (payload: TLoginUser) => {
  const user = await User.findOne({ email: payload?.email }).select(
    '+password',
  );

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!!');
  }
  // // checking if the password is correct
  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched !!');
  }

  const userData = await User.isUserExistsByEmail(payload?.email);

  const jwtPayload = {
    email: user?.email ?? '',
    role: user?.role ?? '',
    userId: user?._id ?? '',
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

const refreshTokenService = async (token: string) => {
  console.log("token",token)
  if (!token) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'You are not provided refresh token !!',
    );
  }

  // check if the token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);
  //   const {userId,role} = decoded;
  const { userId, iat } = decoded;

  const user = await User.isUserExistsByid(userId);
  // checking if the user is exist
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !!');
  }

  

  // console.log('requiredRoles', requiredRoles, 'role',role);

  if (
    user?.passwordChangeAt &&
    User.isJwtIssuedBeforePasswordChanged(user.passwordChangeAt, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!!!!!');
  }

  const jwtPayload = {
    userId: user?._id ?? '',
    role: user?.role ?? ' ',
    email: user?.email ?? '',
  };
  // create access token and send client
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  console.log(accessToken, 'accessToken');

  return {
    accessToken,
  };
};

const userGetService = async(payload:string)=>{
// console.log('payload', payload)
  const user = await User.findById(payload);
  if(!user){
    throw new AppError(404, "User not found!")
  }

  return user;

}

const getAllUsersService = async (query: Record<string, unknown>) => {
  const usersQuery = new QueryBuilder(
    User.find({}),
    query
  )
    .search(['name','email'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await usersQuery.modelQuery;
  const meta = await usersQuery.countTotal();
  return { meta, result };
};
export const AuthServices = {
  signupService,
  loginService,
  refreshTokenService,
  userGetService,
  getAllUsersService,
};
