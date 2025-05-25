import React, { createContext, useContext, useState, useEffect } from 'react';
import { getWeatherByCoords, getWeatherByCity, getForecastByCity, getForecastByCoords, getUserLocation, WeatherData, ForecastData, getWeatherCondition, getSuggestedWeatherTag } from '../services/weather';
import { useUser } from './UserContext';

interface WeatherContextType {
  weatherData: WeatherData | null;
  forecastData: ForecastData | null;
  weatherCondition: string;
  suggestedWeatherTag: 'summer' | 'winter' | 'inbetween';
  isLoading: boolean;
  error: string | null;
  updateLocation: (city: string) => Promise<void>;
  refreshWeather: () => Promise<void>;
  getForecastForSlot: (day: string, time: string) => WeatherData | null;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useUser();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      refreshWeather();
    }
  }, [currentUser]);

  const refreshWeather = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const savedLocation = currentUser?.preferences?.location;
      if (savedLocation) {
        const [data, forecast] = await Promise.all([
          getWeatherByCity(savedLocation),
          getForecastByCity(savedLocation)
        ]);
        setWeatherData(data);
        setForecastData(forecast);
      } else {
        const location = await getUserLocation();
        if (location) {
          const [data, forecast] = await Promise.all([
            getWeatherByCoords(location.lat, location.lon),
            getForecastByCoords(location.lat, location.lon)
          ]);
          setWeatherData(data);
          setForecastData(forecast);
        } else {
          const [data, forecast] = await Promise.all([
            getWeatherByCity('New York'),
            getForecastByCity('New York')
          ]);
          setWeatherData(data);
          setForecastData(forecast);
        }
      }
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError('Failed to fetch weather data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateLocation = async (city: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const [data, forecast] = await Promise.all([
        getWeatherByCity(city),
        getForecastByCity(city)
      ]);
      setWeatherData(data);
      setForecastData(forecast);
    } catch (err) {
      console.error('Error updating location:', err);
      setError('Failed to update location. Please check the city name and try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to get forecast for a specific day/time slot
  const getForecastForSlot = (day: string, time: string): WeatherData | null => {
    if (!forecastData) return null;
    // Map day/time to a date string and hour range
    const now = new Date();
    let targetDate = new Date(now);
    if (day !== 'today') {
      const daysOfWeek = ['sun','mon','tue','wed','thu','fri','sat'];
      const todayIdx = now.getDay();
      let targetIdx = daysOfWeek.indexOf(day.toLowerCase());
      if (targetIdx === -1) return null;
      let diff = targetIdx - todayIdx;
      if (diff < 0) diff += 7;
      targetDate.setDate(now.getDate() + diff);
    }
    // Set hour range for time slot
    let hourStart = 6, hourEnd = 12;
    if (time === 'afternoon') { hourStart = 12; hourEnd = 18; }
    if (time === 'night') { hourStart = 18; hourEnd = 23; }
    // Find closest forecast in that day/time slot
    const targetDayStr = targetDate.toISOString().slice(0, 10);
    const slot = forecastData.list.find(item => {
      const itemDate = new Date(item.dt_txt);
      const itemDayStr = itemDate.toISOString().slice(0, 10);
      const hour = itemDate.getHours();
      return itemDayStr === targetDayStr && hour >= hourStart && hour < hourEnd;
    });
    return slot || null;
  };

  // Derived state
  const weatherCondition = weatherData 
    ? getWeatherCondition(weatherData.weather[0].id)
    : 'unknown';

  const suggestedWeatherTag = weatherData 
    ? getSuggestedWeatherTag(weatherData.main.temp)
    : 'inbetween';

  return (
    <WeatherContext.Provider
      value={{
        weatherData,
        forecastData,
        weatherCondition,
        suggestedWeatherTag,
        isLoading,
        error,
        updateLocation,
        refreshWeather,
        getForecastForSlot
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = (): WeatherContextType => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};