export function kmToMiles(km: number) {
  return km * 0.621371;
}

export function milesToKm(miles: number) {
  return miles * 1.60934;
}

export function litersToGallons(liters: number) {
  return liters * 3.78541;
}

export function gallonsToLiters(gallons: number) {
  return gallons * 0.264172;
}

export function kmToMeters(km: number) {
  return km * 1000;
}

export function milesToMeters(miles: number) {
  return miles * 1609.34;
}

export function metersToKm(meters: number) {
  return meters / 1000;
}

export function metersToMiles(meters: number) {
  return meters / 1609.34;
}

export function convertToMetric(
  value: number,
  units: "imperial" | "metric" = "metric",
) {
  if (units === "metric") return value;

  return Math.round(value * 1.60934);
}
