/* eslint-disable @typescript-eslint/no-this-alias */

import { TUser, UserModel } from './user.interface';
import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../../config';
import { USER_ROLE, USER_STATUS } from './user.constant';

const userSchema = new Schema<TUser, UserModel>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: 0,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      unique: true,
    },
    role: {
      type: String,
      enum: Object.keys(USER_ROLE),
      default: USER_ROLE.user,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    profileImg: {
      type: String,
      required: [true, 'Profile Image is required'],
    },
    passwordChangeAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default: USER_STATUS.IN_PROGRESS
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  const user = this;

  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_solt_rounds),
  );

  next();
});
userSchema.post('save', function (doc, next) {
  doc.password = '';

  next();
});

userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await User.findOne({ email: email });
};

userSchema.statics.isUserExistsByid = async function (id: string) {
  return await User.findById(id);
};

userSchema.statics.isUserExistsByNumber = async function (phone: string) {
  return await User.findOne({ phone });
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isJwtIssuedBeforePasswordChanged = async function (
  passwordChangedTimeStamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimeStamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};


export const User = model<TUser, UserModel>('User', userSchema);
