import { Response } from 'express';
import jwt from 'jsonwebtoken';

export const createToken = (
  jwtPayload: { email: string; role: string },
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};


type TLoginResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  token:string;
  data: T;
};

export const sendLoginResponse = <T>(res: Response, data: TLoginResponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    token:data.token,
    data: data.data,
  });
};


