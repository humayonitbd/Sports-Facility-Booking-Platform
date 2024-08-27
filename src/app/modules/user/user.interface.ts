import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export type TUser = {
  _id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  passwordChangeAt?: Date;
  role?: keyof typeof USER_ROLE;
  address: string;
  profileImg: string;
  status: 'in-progress' | 'blocked';
};

export interface UserModel extends Model<TUser> {
  isUserExistsByEmail(email: string): Promise<TUser>;
  isUserExistsByid(id: string): Promise<TUser>;
  isUserExistsByNumber(num: string): Promise<TUser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isJwtIssuedBeforePasswordChanged(
    passwordChangedTimeStamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}
