import moment from 'moment-timezone';

export const formatToWAT = (utcTimestamp) => {
  return moment.utc(utcTimestamp).tz('Africa/Lagos').format('YYYY-MM-DD HH:mm:ss');
}; 