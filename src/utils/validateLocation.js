function isLatitude(lat) {
  return isFinite(lat) && Math.abs(lat) <= 90;
}

function isLongitude(lng) {
  return isFinite(lng) && Math.abs(lng) <= 180;
}

export default function validateLatLong(lat, lng) {
  return isLatitude(lat) && isLongitude(lng);
}
