export type UserLocation = {
  lat: number;
  lng: number;
  timezone: string;
  city?: string;
  country?: string;
};

export type SunPosition = {
  altitude: number;
  azimuth: number;
  hour: number;
  isDay: boolean;
  sunrise: number;
  sunset: number;
};

export function detectLocation(): Promise<UserLocation> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({
        lat: 40.7128,
        lng: -74.006,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
      },
      () => {
        resolve({
          lat: 40.7128,
          lng: -74.006,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 300000 }
    );
  });
}

export function calculateSunPosition(lat: number, lng: number): SunPosition {
  const now = new Date();
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
  const hour = now.getUTCHours() + now.getUTCMinutes() / 60 + lng / 15;
  const declination = 23.44 * Math.sin((360 / 365) * (dayOfYear - 81) * (Math.PI / 180));
  const hourAngle = (hour - 12) * 15;
  const latRad = lat * (Math.PI / 180);
  const decRad = declination * (Math.PI / 180);
  const haRad = hourAngle * (Math.PI / 180);
  const altitude = Math.asin(
    Math.sin(latRad) * Math.sin(decRad) + Math.cos(latRad) * Math.cos(decRad) * Math.cos(haRad)
  );
  const azimuth = Math.atan2(
    -Math.sin(haRad),
    Math.tan(decRad) * Math.cos(latRad) - Math.sin(latRad) * Math.cos(haRad)
  );
  const sunriseHour = 12 - (Math.acos(-Math.tan(latRad) * Math.tan(decRad)) * 180 / Math.PI) / 15;
  const sunsetHour = 12 + (Math.acos(-Math.tan(latRad) * Math.tan(decRad)) * 180 / Math.PI) / 15;
  const localHour = (hour + 24) % 24;

  return {
    altitude: altitude * (180 / Math.PI),
    azimuth: azimuth * (180 / Math.PI),
    hour: localHour,
    isDay: localHour >= sunriseHour && localHour <= sunsetHour,
    sunrise: sunriseHour,
    sunset: sunsetHour,
  };
}

export function getTimeOfDay(hour: number): 'dawn' | 'day' | 'dusk' | 'night' {
  if (hour >= 5 && hour < 8) return 'dawn';
  if (hour >= 8 && hour < 17) return 'day';
  if (hour >= 17 && hour < 20) return 'dusk';
  return 'night';
}
