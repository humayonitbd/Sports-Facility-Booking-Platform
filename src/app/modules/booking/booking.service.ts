
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { AppError } from '../../error/AppError';
import { TBooking } from './booking.interface';
import { Booking } from './booking.model';
import { BOOKING_STATUS, bookingSearchableFields } from './booking.constant';
import { JwtPayload } from 'jsonwebtoken';
import { Facility } from '../facility/facility.model';
import { User } from '../user/user.model';
import { USER_ROLE } from '../user/user.constant';
import { convertToISODateString, dateTimeConflict, formatDate, validateDateFormat } from './booking.utils';
const { ObjectId } = require('mongoose').Types;

const createBookingService = async (
  userData: JwtPayload,
  payload: TBooking,
) => {
  const bodyData = payload;
  const { facility, startTime, endTime,date } = bodyData;
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

const assignedSchedules = await Booking.find({
  user: userId,
  date: date,
}).select('date startTime endTime');

const newSchedules = {
  startTime,
  endTime,
  date,
};

if (dateTimeConflict(assignedSchedules, newSchedules)) {
  throw new AppError(
    httpStatus.CONFLICT,
    `This facility is not available at that time ! Choose other time or day`,
  );
}


  // Calculate the duration in hours
  const durationInMilliseconds = endDateTime - startDateTime;
  const durationInHours = durationInMilliseconds / (1000 * 60 * 60);

  // Calculate the payable amount
  const payableAmount = durationInHours * Number(facilityData.pricePerHour);

  
  const result = await Booking.create({
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

  const result = await facultyQuery.modelQuery ;
  return result;
};

const userGetBookingService = async (userInfo:JwtPayload) => {
    console.log(userInfo.role,'role', userInfo.email)
    const user = await User.isUserExistsByEmail(userInfo?.email);
    if(!user){
         throw new AppError(httpStatus.NOT_FOUND, 'User is not found!!');
    }

    if(user?.role !== USER_ROLE?.user){
         throw new AppError(httpStatus.NOT_FOUND, 'User is not found!!');
    }

  const result = await Booking.find({ user: userInfo?.userId }).populate(
    'facility',
  );
  
  return result;
};

const deleteBookingService = async (userInfo:JwtPayload,id: string) => {
    const booked = await Booking.findById(id);
    if(!booked){
         throw new AppError(httpStatus.NOT_FOUND, 'Booking is not found!!');
    }

    const userId = new ObjectId(userInfo.userId);
    const bookedUserId = new ObjectId(booked.user);

    if (!userId.equals(bookedUserId)) {
      throw new AppError(httpStatus.NOT_FOUND, 'Booking is not found!!!');
    }
    
      const deletedBooking = await Booking.findByIdAndUpdate(
        id,
        { isBooked: BOOKING_STATUS.canceled },
        { new: true },
      ).populate('facility');
  if (!deletedBooking) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to deleted Booking!!');
  }
  return deletedBooking;
};


const availabilityBookingService = async (dateData: string) => {
  if (!validateDateFormat(dateData)) {
    throw new Error('Invalid date format. Date must be in DD-MM-YYYY format.');
  }

  const currentDate = new Date();
  const updateDate = formatDate(currentDate);
  const dateInfo = convertToISODateString(dateData) || updateDate;

  console.log('convert', dateInfo);
  const availableSlotsDate = await Booking.find({ date: dateInfo });
    console.log("availableSlots",availableSlotsDate);
  const bookedTimeSlots = availableSlotsDate.map((data) => ({
    startTime: data.startTime,
    endTime: data.endTime,
  }));

  console.log('bookedTimeSlots', bookedTimeSlots);
  // Define the range of time slots from "01:00" to "24:00"
  const availableStartTime = '00:00';
  const availableEndTime = '23:59';

  // Initialize available time slots with the full range
  let availableSlots: { startTime: string; endTime: string }[] = [
    { startTime: availableStartTime, endTime: availableEndTime },
  ];

  // Function to convert time string to minutes
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Filter out booked time slots from available time slots
  for (const booking of bookedTimeSlots) {
    availableSlots = availableSlots.reduce(
      (result, slot) => {
        const slotStartMinutes = timeToMinutes(slot.startTime);
        const slotEndMinutes = timeToMinutes(slot.endTime);
        const bookingStartMinutes = timeToMinutes(booking.startTime);
        const bookingEndMinutes = timeToMinutes(booking.endTime);

        // Check if booking overlaps with slot
        if (
          bookingStartMinutes < slotEndMinutes &&
          bookingEndMinutes > slotStartMinutes
        ) {
          // Split the slot into two parts if it overlaps with the booking
          if (slotStartMinutes < bookingStartMinutes) {
            result.push({
              startTime: slot.startTime,
              endTime: booking.startTime,
            });
          }
          if (slotEndMinutes > bookingEndMinutes) {
            result.push({ startTime: booking.endTime, endTime: slot.endTime });
          }
        } else {
          result.push(slot); // Keep the slot if it doesn't overlap
        }
        return result;
      },
      [] as { startTime: string; endTime: string }[],
    ); // Specify the type explicitly
  }

  // console.log('dateTimeString', dateTimeString);
  return availableSlots;
};

export const BookingServices = {
  createBookingService,
  getAllBookingService,
  userGetBookingService,
  deleteBookingService,
  availabilityBookingService,
};