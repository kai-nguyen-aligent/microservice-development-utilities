/**
  * Convert a date into a different timezone
  * @param date the date to convert (in UTC)
  * @param timezone the timezone to convert the date into
  */
function getDateByTimezone(date: string | number | Date, timezone: string) {
  if (!timezone) {
    throw new Error('timezone is undefined');
  }
  if (!date) {
    throw new Error('date is undefined');
  }
  const previousTimezone = process.env.TZ;
  process.env.TZ = timezone;
  const newDate = new Date(date);
  process.env.TZ = previousTimezone;
  return newDate;
}

export default getDateByTimezone;
