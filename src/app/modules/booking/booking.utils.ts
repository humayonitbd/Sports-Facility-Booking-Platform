import { isValid, parse } from 'date-fns';
import { TSchedule } from './booking.interface';

// validdate check here 
export const validateDateFormat = (dateString:any) => {
  const parsedDate = parse(dateString, 'dd-MM-yyyy', new Date());
  return isValid(parsedDate);
};

// Convert to YYYY-MM-DD format
export const convertToISODateString = (dateString: string) => {
  const [day, month, year] = dateString.split('-').map(Number);
  const date = new Date(year, month-1 , day+1);
  return date.toISOString().split('T')[0]; 
};


export const formatDate = (dateTime: Date): string => {
  const date = new Date(dateTime);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();
  // Format the date as DD-MM-YYYY
  const formattedDate = `${day}-${month}-${year}`;

  return formattedDate;
};



export const dateTimeConflict = (
  assignedSchedules: TSchedule[],
  newSchedule: TSchedule,
) => {
  for (const schedule of assignedSchedules) {
    const existingStartTime = new Date(`1970-01-01T${schedule.startTime}`);
    const existingEndTime = new Date(`1970-01-01T${schedule.endTime}`);
    const newStartTime = new Date(`1970-01-01T${newSchedule.startTime}`);
    const newEndTime = new Date(`1970-01-01T${newSchedule.endTime}`);

    if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
      return true;
    }
  }

  return false;
};