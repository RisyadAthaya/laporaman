const EARTH_RADIUS_KM = 6371;

const toRadians = (degrees) => (degrees * Math.PI) / 180;

export const haversineDistanceKm = (lat1, lon1, lat2, lon2) => {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
};

export const formatDistance = (km) => {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
};

export const createGeoJSONCircle = (latitude, longitude, radiusKm, points = 64) => {
  const coordinates = [];
  const distanceX = radiusKm / (111.32 * Math.cos(toRadians(latitude)));
  const distanceY = radiusKm / 110.574;

  for (let i = 0; i < points; i++) {
    const angle = (i / points) * 2 * Math.PI;
    coordinates.push([
      longitude + distanceX * Math.cos(angle),
      latitude + distanceY * Math.sin(angle)
    ]);
  }
  coordinates.push(coordinates[0]);

  return {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [coordinates]
    }
  };
};

export const getBoundsForRadius = (latitude, longitude, radiusKm) => {
  const distanceX = radiusKm / (111.32 * Math.cos(toRadians(latitude)));
  const distanceY = radiusKm / 110.574;

  return [
    [longitude - distanceX, latitude - distanceY],
    [longitude + distanceX, latitude + distanceY]
  ];
};
