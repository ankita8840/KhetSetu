/**
 * Wraps the browser Geolocation API in a promise. Resolves with
 * {latitude, longitude} or rejects with a short reason string —
 * never throws unhandled, so callers can just .catch() and fall back.
 */
export function getCurrentCoords({ timeout = 8000 } = {}) {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject("unsupported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (err) => {
        reject(err?.code === 1 ? "denied" : "unavailable");
      },
      { timeout, maximumAge: 1000 * 60 * 10 }
    );
  });
}
