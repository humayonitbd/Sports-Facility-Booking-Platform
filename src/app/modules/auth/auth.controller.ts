import httpStatus from 'http-status';
import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';
import { sendLoginResponse } from './auth.utils';

const signupUser = catchAsync(async (req, res) => {
  // console.log("controller user",req.body)
  const result = await AuthServices.signupService(req.body);

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
    message: 'User registered successfully',
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginService(req.body);
  const { refreshToken, accessToken, userData } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });

  if (!result) {
    sendLoginResponse(res, {
      success: false,
      statusCode: httpStatus.NOT_FOUND,
      message: 'No Data Found!',
      token: '',
      data: '',
    });
  }

  sendLoginResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User logged in successfully',
    token: accessToken,
    data: userData,
  });
});

const refreshTokenController = catchAsync(async (req, res) => {
  console.log('hit hoise ')
  const { refreshToken } = req.cookies;
  console.log('refreshToken', refreshToken);
  const result = await AuthServices.refreshTokenService(refreshToken);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Refresh token access successfully!',
    data: result,
  });
});

const userGet = catchAsync(async (req, res) => {
  const user = req.params.id;
  console.log('user',user)
  const result = await AuthServices.userGetService(user);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User get successfully!',
    data: result,
  });
});

export const authControllers = {
  signupUser,
  loginUser,
  refreshTokenController,
  userGet,
};
