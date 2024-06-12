
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { AppError } from '../../error/AppError';
import { TBooking } from './booking.interface';
import { Booking } from './booking.model';
import { BOOKING_STATUS, bookingSearchableFields } from './booking.constant';
import { JwtPayload } from 'jsonwebtoken';
import { Facility } from '../facility/facility.model';
import { User } from '../user/user.model';

const createBookingService = async (
  userData: JwtPayload,
  payload: TBooking,
) => {
  const bodyData = payload;
  const { facility, startTime, endTime, date } = bodyData;
  const { email, role, userId } = userData;
  const startDateTime = new Date(`1980-01-01T${startTime}:00`).getTime();
  const endDateTime = new Date(`1980-01-01T${endTime}:00`).getTime();

  const facilityData = await Facility.isFacilityExistsByid(facility.toString());

  if (!facilityData) {
    throw new AppError(httpStatus.NOT_FOUND, 'Facility is not found!!');
  }

  if (facilityData?.isDeleted === true) {
    throw new AppError(httpStatus.NOT_FOUND, 'Facility is not found!!');
  }

  const usersData = await User.isUserExistsByEmail(email);
  if (!usersData) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not found!!');
  }

  const userById = await User.isUserExistsByid(userId);
  if (!userById) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not found!!');
  }

  if (usersData?.role !== role) {
    throw new AppError(httpStatus.NOT_FOUND, 'You are not User!!');
  }
  // Calculate the duration in hours
  const durationInMilliseconds = endDateTime - startDateTime;
  const durationInHours = durationInMilliseconds / (1000 * 60 * 60);

  // Calculate the payable amount
  const payableAmount = durationInHours * Number(facilityData.pricePerHour);

  
  const result = await Booking.create({
    // facility,
    // startTime,
    // endTime,
    // date: formattedDate,
    // formattedDate,
    ...bodyData,
    user: userId,
    payableAmount: payableAmount,
    isBooked: BOOKING_STATUS.confirmed,
  });
  return result;
};

const getAllBookingService = async (query: Record<string, unknown>) => {
  const facultyQuery = new QueryBuilder(
    Booking.find().populate('facility').populate('user'),
    query,
  )
    .search(bookingSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await facultyQuery.modelQuery;
  return result;
};

const updateBookingService = async (
  id: string,
  payload: Partial<TBooking>,
) => {
  const result = await Booking.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const deleteBookingService = async (id: string) => {
  
  const deletedBooking = await Booking.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!deletedBooking) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to deleted Booking!!');
  }
  return deletedBooking;
};

export const BookingServices = {
  createBookingService,
  getAllBookingService,
  updateBookingService,
  deleteBookingService,
};