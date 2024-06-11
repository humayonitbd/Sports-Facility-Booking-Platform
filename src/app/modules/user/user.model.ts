/* eslint-disable @typescript-eslint/no-this-alias */

import { TUser } from './user.interface';
import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../../config';
import { USER_ROLE } from './user.constant';

const userSchema = new Schema<TUser>(
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
    },
    role: {
      type: String,
      enum: Object.keys(USER_ROLE),
    
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  const user = this;

  user.password = await bcrypt.hash(user.password, Number(config.bcrypt_solt_rounds));

  next();
});
userSchema.post('save', function (doc, next) {
  doc.password = '';

  next();
});

export const User = model<TUser>('User', userSchema);
