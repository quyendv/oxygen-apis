export function getTimeRangeByDate(date) {
  const from = new Date(date);
  const to = new Date(date);

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
