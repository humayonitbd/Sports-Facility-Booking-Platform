import { Schema, model } from 'mongoose';
import { TBooking } from './booking.interface';
import { BOOKING_STATUS } from './booking.constant';

const bookingSchema = new Schema<TBooking>(
  {
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    facility: {
      type: Schema.Types.ObjectId,
      ref: 'Facility',
      required: [true, 'Facility is required'],
    },
    payableAmount: {
      type: Number,
      required: false,
    },
    isBooked: {
      type: String,
      required: true,
      enum: Object.keys(BOOKING_STATUS),
      default: BOOKING_STATUS.unconfirmed,
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Shipped', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending',
    },
    transactionId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Booking = model<TBooking>('Booking', bookingSchema);
