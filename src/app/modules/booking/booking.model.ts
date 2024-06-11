import { Schema, model } from "mongoose";
import { TBooking } from "./booking.interface";
import { BOOKING_STATUS } from "./booking.constant";


const bookingSchema = new Schema<TBooking>(
  {
    date: {
      type: Date,
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
      required: [true, 'User is required'],
    },
    facility: {
      type: Schema.Types.ObjectId,
      ref: 'Facility',
      required: [true, 'Facility is required'],
    },
    payableAmount: {
      type: Number,
      required: [true, 'Payable amount is required'],
    },
    isBooked: {
      type: String,
      required: [true, 'Booking status is required'],
      enum: Object.keys(BOOKING_STATUS),
    },
  },
  {
    timestamps: true,
  },
);

export const Booking = model<TBooking>('Booking', bookingSchema);
