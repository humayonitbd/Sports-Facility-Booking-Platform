
## Sports  Facility Booking System

## Overview
The Facility Booking System is a TypeScript-based web application built on Express.js and MongoDB using Mongoose. It provides functionalities for users to register, log in, manage facilities, and make bookings. Admin users can also perform additional actions such as managing facilities and viewing all bookings.

## Features

## User Management:
1. User registration with roles (admin and user).
2. User authentication and login using JSON Web Tokens (JWT).

## Facility Management:
1. Admins can add, update, delete (soft delete), and retrieve facilities.
2. Each facility includes details such as name, description, price per hour, location, and deletion status.

## Booking Management:
1. Users can check the availability of facilities for specific dates and times.
2. Users can create bookings specifying the facility, date, start time, and end time.
3. Admins can view all bookings and users can view their own bookings.
4. Bookings calculate payable amounts based on the duration and facility price per hour.

## Error Handling:
1. Comprehensive error handling with descriptive error messages and appropriate HTTP status codes.
2. Global error handling middleware ensures consistent error responses.

## Validation:
1. Input validation using Zod to ensure data consistency and prevent malformed requests.
2. Detailed error responses (400 Bad Request) for validation failures.

## API Documentation
## User Routes
1. POST /api/auth/signup -> (Register a new user)

2. POST /api/auth/login -> (Log in a registered user)

## Facility Routes (admin Only)
1. POST /api/facility -> (Add a new facility)
2. PUT /api/facility/:id -> (Update an existing facility)
3. DELETE /api/facility/:id -> (Soft delete a facility)
4. GET /api/facility -> (Retrieve all facilities)

## Booking Routes (user Only)
1. GET /api/check-availability -> (Check availability of time slots for booking)
2. POST /api/bookings -> (Create a new booking(user Only))
3. GET /api/bookings -> (View all bookings (Admin Only))
4. GET /api/bookings/user -> (View bookings by user (User Only))
5. DELETE /api/bookings/:id -> (Cancel a booking (User Only))


## Error Handler Features
1. No Data Found Handling: Proper handling for empty or non-existent data responses.
2. Not Found Route: Global handler for unmatched routes.
3. Authentication Middleware: Middleware to enforce route access based on user roles.


## Installation and Setup
1. Clone the repository: https://github.com/humayonitbd/Sports-Facility-Booking-Platform

2. Install dependencies: npm install
3. Environment Variables: .env file create 
4. Run the application: npm start

## Project Live Link: 