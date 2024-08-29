import { Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const createToken = (
  jwtPayload: { email: string; role: string; userId: string },
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};

type TLoginResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  token: string;
  data: T;
};

export const sendLoginResponse = <T>(
  res: Response,
  data: TLoginResponse<T>,
) => {
  res.status(data.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    token: data.token,
    data: data.data,
  });
};
