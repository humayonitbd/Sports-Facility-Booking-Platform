import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";

const createStudent = catchAsync(async (req, res) => {
  const { password } = req.body;

  const result = await UserServices.createUserService(password);

  if (!result) {
    sendResponse(res, {
      success: false,
      statusCode: httpStatus.NOT_FOUND,
      message: 'No Data Found!',
      data: [],
    });
  

  }
  // console.log(result)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User is created succesfully!',
    data: result,
  });
});


export const UserControllers = {
  createStudent,

};
