/**
 * Weather Controller
 * Uses OpenWeatherMap if OPENWEATHER_API_KEY is set, otherwise returns
 * realistic mock data so the dashboard works out of the box for demos.
 *
 * Supports two ways of looking up weather:
 *  - ?city=Lucknow            -> search by place name
 *  - ?lat=26.85&lon=80.94      -> search by coordinates (used for the
 *                                 "use my location" / geolocation flow)
 * If both are present, city search takes priority.
 */

const mockWeather = (label) => ({
  city: label || "Lucknow",
  temperature: 32,
  humidity: 58,
  windSpeed: 11,
  condition: "Partly Cloudy",
  rainChance: 20,
  irrigationSuggestion: "Soil moisture is adequate; irrigation can be delayed by 1-2 days.",
  demo: true,
});

export const getWeather = async (req, res, next) => {
  try {
    console.log("Weather Key:", process.env.OPENWEATHER_API_KEY);
    const { city, lat, lon } = req.query;
    const usingCoords = !city && lat && lon;

    if (!process.env.OPENWEATHER_API_KEY) {
      return res.json(mockWeather(city));
    }

    const url = usingCoords
      ? `https://api.openweathermap.org/data/2.5/weather?lat=${encodeURIComponent(
          lat
        )}&lon=${encodeURIComponent(lon)}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`
      : `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city || "Lucknow"
        )}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== 200) {
      return res.json(mockWeather(city));
    }

    const rainChance = data.rain ? 70 : data.clouds?.all > 60 ? 40 : 10;
    const irrigationSuggestion =
      data.main.humidity > 60
        ? "Humidity is high; irrigation can likely be delayed."
        : "Humidity is low; consider irrigating in the next 24 hours.";

    res.json({
      city: data.name,
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // m/s to km/h
      condition: data.weather[0]?.main || "Clear",
      rainChance,
      irrigationSuggestion,
      demo: false,
    });
  } catch (error) {
    next(error);
  }
};
