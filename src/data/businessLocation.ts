/**
 * Tefera Business Center / Tefera Building is listed at 2PMV+VPP,
 * Fitawrari Gebeyebu Street, Arada, Addis Ababa (GoAfricaOnline/ETHYP).
 * The previous raw coordinate 9.03467,38.744252 maps to 2PMV+VP6,
 * which may be labeled "Sami Electronics" by Google Maps.
 *
 * Coordinate below approximates the center of the building's 2PMV+VPP
 * Plus Code cell. This is the building, not a particular office or shop.
 */
export const businessLocation = {
  buildingName: 'Tefera Building',
  buildingNameAmharic: 'ተፈራ ህንጻ',
  streetArea: 'Habte Giyorgis, Fitawrari Gebeyebu Street',
  city: 'Addis Ababa',
  latitude: 9.034712,
  longitude: 38.744330,
  plusCode: '2PMV+VPP',
  // Google destinations target the independently listed building Plus Code
  // or search its name, instead of resolving an adjacent shop by GPS.
  directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=2PMV%2BVPP%2C%20Addis%20Ababa%2C%20Ethiopia',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Tefera%20Business%20Center%2C%20Fitawrari%20Gebeyebu%20Street%2C%20Arada%2C%20Addis%20Ababa',
  openStreetMapUrl: 'https://www.openstreetmap.org/?mlat=9.034712&mlon=38.744330#map=18/9.034712/38.744330',
  // Marker-based OpenStreetMap embed avoids Google Maps' automatic
  // selection of Sami Electronics as the title of our map.
  embedUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=38.74295%2C9.03365%2C38.74571%2C9.03577&layer=mapnik&marker=9.034712%2C38.744330',
} as const;
