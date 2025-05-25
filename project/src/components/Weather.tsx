import { useState, useEffect } from 'react';
import { getWeatherByCity, getWeatherByCoords } from '../services/weatherService';

interface WeatherProps {
  city?: string;
}

export const Weather = ({ city }: WeatherProps) => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let weatherData;
        if (city) {
          weatherData = await getWeatherByCity(city);
        } else {
          // Get user's location if no city is provided
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          weatherData = await getWeatherByCoords(
            position.coords.latitude,
            position.coords.longitude
          );
        }
        
        setWeather(weatherData);
      } catch (err) {
        setError('Failed to fetch weather data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  if (loading) {
    return <div className="p-4">Loading weather data...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!weather) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-sm mx-auto">
      <h2 className="text-2xl font-bold mb-4">{weather.name}</h2>
      <div className="flex items-center justify-between">
        <div>
          <img
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
            className="w-16 h-16"
          />
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold">{Math.round(weather.main.temp)}°C</p>
          <p className="text-gray-600 capitalize">{weather.weather[0].description}</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-600">Feels like</p>
          <p className="font-semibold">{Math.round(weather.main.feels_like)}°C</p>
        </div>
        <div>
          <p className="text-gray-600">Humidity</p>
          <p className="font-semibold">{weather.main.humidity}%</p>
        </div>
        <div>
          <p className="text-gray-600">Wind</p>
          <p className="font-semibold">{weather.wind.speed} m/s</p>
        </div>
      </div>
    </div>
  );
}; 