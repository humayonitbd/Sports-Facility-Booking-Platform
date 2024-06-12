
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BookingServices } from './booking.service';
import { Facility } from '../facility/facility.model';
import { AppError } from '../../error/AppError';
import { User } from '../user/user.model';
import { BOOKING_STATUS } from './booking.constant';



const createBooking = catchAsync(async (req, res) => {
  // console.log('user',req.user, 'body',req.body);
  // const bodyData = req.body;
  // const { facility } = bodyData;
  // const {email,role, userId} = req.user;
  // console.log(req.user);

  // const facilityData = await Facility.isFacilityExistsByid(facility);
  // if (!facilityData) {
  //     throw new AppError(httpStatus.NOT_FOUND,"Facility is not found!!")
  // }

  // const userData = await User.isUserExistsByEmail(email);
  // if (!userData) {
  //   throw new AppError(httpStatus.NOT_FOUND, 'User is not found!!');
  // }

  // const userById = await User.isUserExistsByid(userId);
  // if (!userById) {
  //   throw new AppError(httpStatus.NOT_FOUND, 'User is not found!!');
  // }

  // if (userData?.role !== role) {
  //   throw new AppError(httpStatus.NOT_FOUND, 'You are not User!!');
  // }

  //    , {
  //     ...bodyData,
  //     isBooked: BOOKING_STATUS.confirmed,
  //     user: userId,
  //   }

  const result = await BookingServices.createBookingService(req.user, req.body);
//   // Format date to 'YYYY-MM-DD'
  const formattedDate = new Date(result?.date).toISOString().split('T')[0];
  const responseData = {
    ...result.toObject(),
    date: formattedDate,
  };
// console.log('responseData', responseData);
  if (!result) {
    sendResponse(res, {
      success: false,
      statusCode: httpStatus.NOT_FOUND,
      message: 'No Data Found!',
      data: [],
    });
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Booking created successfully',
    data: responseData,
  });
});

const getAllBooking = catchAsync(async (req, res) => {
  const result = await BookingServices.getAllBookingService(req.query);

  if (!result) {
    sendResponse(res, {
      success: false,
      statusCode: httpStatus.NOT_FOUND,
      message: 'No Data Found!',
      data: [],
    });
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Facilities retrieved successfully',
    data: result,
  });
});

const updateBooking = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BookingServices.updateBookingService(id, req.body);

  if (!result) {
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'No Data Found!',
      data: [],
    });
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Booking updated successfully',
    data: result,
  });
});

const deleteBooking = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BookingServices.deleteBookingService(id);

  if (!result) {
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'No Data Found!',
      data: [],
    });
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Booking deleted successfully',
    data: result,
  });
});

export const BookingControllers = {
  createBooking,
  getAllBooking,
  updateBooking,
  deleteBooking,
};
