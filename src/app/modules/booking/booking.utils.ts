import { isValid, parse } from 'date-fns';
export const validateDateFormat = (dateString:any) => {
  const parsedDate = parse(dateString, 'dd-MM-yyyy', new Date());
  return isValid(parsedDate);
};


export const convertToISODateString = (dateString: string) => {
  const [day, month, year] = dateString.split('-').map(Number);
  const date = new Date(year, month-1 , day+1);
  return date.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
};


export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};