import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { AppError } from '../../error/AppError';
import { facilitySearchableFields } from './facility.constant';
import { TFacility } from './facility.interface';
import { Facility } from './facility.model';

const createFacilityService = async (payload: TFacility) => {
  const facility = await Facility.findOne({ name: payload?.name });
  if (facility) {
    throw new AppError(httpStatus.NOT_FOUND, 'facility is already Exists!!');
  }
  const result = await Facility.create(payload);
  return result;
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
  return result;
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

  const result = await Facility.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const deleteFacilityService = async (id: string) => {
  const facility = await Facility.isFacilityExistsByid(id);
  if (!facility) {
    throw new AppError(httpStatus.NOT_FOUND, 'Facility is not found!!');
  }
  if (facility?.isDeleted === true) {
    throw new AppError(httpStatus.NOT_FOUND, 'Facility is found!!');
  }
  const deletedFacility = await Facility.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!deletedFacility) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to deleted Facility!!');
  }
  return deletedFacility;
};

export const FacilityServices = {
  createFacilityService,
  getAllFacilityService,
  updateFacilityService,
  deleteFacilityService,
};
