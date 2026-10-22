/**
 * Tefera Business Center / ተፈራ ህንጻ near Habte Giyorgis, Addis Ababa.
 * The business supplied its exact Google Maps short link:
 * https://maps.app.goo.gl/xUmBZS7HQ9JwpVcL9
 *
 * Verified resolved Google place:
 * CID 2913981607394043387 (0x28708ad53ebe65fb).
 * Map listing GPS: 9.0347089, 38.7443215.
 * This is a building reference; specific Universal Electronics shop/floor
 * has not been independently verified.
 *
 * Never use nearby raw-address coordinates or a generic "electronics"
 * lookup for this location: they can resolve to Sami Electronics.
 */
export const businessLocation = {
  buildingName: 'Tefera Building',
  buildingNameAmharic: 'ተፈራ ህንጻ',
  googleListingName: 'Tefera Business Center | Habte Giyorgis',
  streetArea: 'Habte Giyorgis, Fitawrari Gebeyebu Street',
  city: 'Addis Ababa',
  latitude: 9.0347089,
  longitude: 38.7443215,
  plusCode: '2PMV+VPP',
  googlePlaceCid: '2913981607394043387',
  // The exact URL selected and supplied by Universal Electronics.
  googleMapsUrl: 'https://maps.app.goo.gl/xUmBZS7HQ9JwpVcL9',
  // Google Maps previously confirmed that this named destination resolves
  // to Tefera Business Center (rather than Sami Electronics).
  directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Tefera%20Business%20Center%2C%20Habte%20Giyorgis%2C%20Addis%20Ababa',
  // Embed by Google place CID; no nearest-business coordinate inference.
  embedUrl: 'https://www.google.com/maps/embed?origin=mfe&pb=!1m3!3m2!1m1!4s2913981607394043387',
  openStreetMapUrl: 'https://www.openstreetmap.org/?mlat=9.0347089&mlon=38.7443215#map=18/9.0347089/38.7443215',
} as const;
