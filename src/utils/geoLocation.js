import geoip from 'geoip-lite';

export const getGeoLocation = (ip) => {
  const geo = geoip.lookup(ip);
  return geo ? {
    country: geo.country,
    city: geo.city,
  } : null;
}