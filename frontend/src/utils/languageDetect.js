import i18n, { LANG_STORAGE_KEY, LANG_AUTO_KEY, STATE_LANGUAGE_MAP } from "../i18n/index.js";

/**
 * Reverse-geocodes lat/lon to a state name using BigDataCloud's free,
 * key-less client-side endpoint, then maps that state to a regional
 * language. Falls back silently on any failure — callers should treat
 * this as best-effort, not required.
 */
async function stateFromCoords(lat, lon) {
  const res = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
  );
  if (!res.ok) throw new Error("reverse geocode failed");
  const data = await res.json();
  return {
    state: (data.principalSubdivision || "").toLowerCase(),
    city: data.city || data.locality || null,
    countryCode: data.countryCode || null,
  };
}

/**
 * Attempts to detect the user's language from their location.
 * Only runs if the person hasn't manually picked a language before
 * (i.e. no explicit choice saved). Safe to call multiple times; it
 * resolves quickly via geolocation cache where possible and never
 * throws — callers don't need a try/catch.
 *
 * Returns the detected language code, or null if detection didn't
 * change anything (denied, unsupported, non-Indian location, etc.)
 */
export function autoDetectLanguageFromLocation() {
  return new Promise((resolve) => {
    const hasManualChoice = localStorage.getItem(LANG_AUTO_KEY) === "false";
    if (hasManualChoice) {
      resolve(null);
      return;
    }
    if (!("geolocation" in navigator)) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const { state } = await stateFromCoords(latitude, longitude);
          const lang = STATE_LANGUAGE_MAP[state];
          if (lang && lang !== i18n.language) {
            i18n.changeLanguage(lang);
            localStorage.setItem(LANG_STORAGE_KEY, lang);
            resolve(lang);
          } else {
            resolve(null);
          }
        } catch {
          resolve(null);
        }
      },
      () => resolve(null), // permission denied / unavailable — fall back silently
      { timeout: 8000, maximumAge: 1000 * 60 * 60 }
    );
  });
}

/** Marks that the person picked a language manually, so we never override it again. */
export function setManualLanguage(code) {
  i18n.changeLanguage(code);
  localStorage.setItem(LANG_STORAGE_KEY, code);
  localStorage.setItem(LANG_AUTO_KEY, "false");
}
