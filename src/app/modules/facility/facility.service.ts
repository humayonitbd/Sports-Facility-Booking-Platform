import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { AppError } from '../../error/AppError';
import { facilitySearchableFields } from './facility.constant';
import { TFacility } from './facility.interface';
import { Facility } from './facility.model';
import mongoose from 'mongoose';

const createFacilityService = async (payload: TFacility) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const facility = await Facility.findOne({ name: payload?.name }).session(
      session,
    );
    if (facility) {
      throw new AppError(httpStatus.NOT_FOUND, 'facility is already Exists!!');
    }
    const result = await Facility.create([payload], { session });

    await session.commitTransaction();
    await session.endSession();
    return result[0];
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error.message);
  }
};
const getAllFacilityService = async (query: Record<string, unknown>) => {
  const facultyQuery = new QueryBuilder(
    Facility.find({ isDeleted: false }),
    query,
  )
    .search(facilitySearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await facultyQuery.modelQuery;
  const meta = await facultyQuery.countTotal();
  return { meta, result };
};

const singleFacilityService = async (payload: string) => {
  const facility = await Facility.isFacilityExistsByid(payload);

  if (!facility) {
    throw new AppError(httpStatus.NOT_FOUND, 'facility is not found!!');
  }

  if (facility.isDeleted === true) {
    throw new AppError(httpStatus.NOT_FOUND, 'facility is not found!!!');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const result = await Facility.findById(payload);

    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error.message);
  }
};

const updateFacilityService = async (
  id: string,
  payload: Partial<TFacility>,
) => {
  const facility = await Facility.isFacilityExistsByid(id);

  if (!facility) {
    throw new AppError(httpStatus.NOT_FOUND, 'facility is not found!!');
  }

  if (facility.isDeleted === true) {
    throw new AppError(httpStatus.NOT_FOUND, 'facility is not found!!!');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const result = await Facility.findByIdAndUpdate(id, payload, {
      new: true,
      session,
    });

    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error.message);
  }
};

const deleteFacilityService = async (id: string) => {
  const facility = await Facility.isFacilityExistsByid(id);
  if (!facility) {
    throw new AppError(httpStatus.NOT_FOUND, 'Facility is not found!!');
  }
  if (facility?.isDeleted === true) {
    throw new AppError(httpStatus.NOT_FOUND, 'Facility is found!!');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const deletedFacility = await Facility.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedFacility) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to deleted Facility!!',
      );
    }

    await session.commitTransaction();
    await session.endSession();
    return deletedFacility;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error.message);
  }
};

export const FacilityServices = {
  createFacilityService,
  getAllFacilityService,
  updateFacilityService,
  deleteFacilityService,
  singleFacilityService,
};
