/**
 * @param {string | undefined} date - yyyy-mm-dd format
 * @returns {[Date, Date]}
 */
export function getTimeRangeByDate(date) {
  let from = new Date(),
    to = new Date();

  if (date) {
    from = new Date(date);
    to = new Date(date);
  }

  from.setHours(0);
  from.setMinutes(0);
  from.setSeconds(0);

  to.setHours(23);
  to.setMinutes(59);
  to.setSeconds(59);

  // from.setUTCHours(0, 0, 0, 0);
  // to.setUTCHours(23, 59, 59, 999);

  return [from, to];
}

/**
 * @param {Date | undefined} from default 7 days ago
 * @param {Date | undefined} to default today
 * @returns {[Date, Date]}
 */
export function getTimeRange(from, to) {
  if (from && !(from instanceof Date)) {
    throw new Error('Get time range params "from" must be a Date instance');
  }

  const fromDate = from ?? getLastDays(7);
  const toDate = to ?? new Date();

  fromDate.setHours(0);
  fromDate.setMinutes(0);
  fromDate.setSeconds(0);

  toDate.setHours(23);
  toDate.setMinutes(59);
  toDate.setSeconds(59);

  return [fromDate, toDate];
}

/**
 * @param {number} days
 * @returns {Date}
 */
export function getLastDays(days) {
  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - days);
  return daysAgo;
}
