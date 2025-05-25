import React from 'react';
import { MapPin, Droplets, Wind } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { format } from 'date-fns';
import { getWeatherIcon } from '../services/weather';

interface WeatherWidgetProps {
  selectedDay: string;
  selectedTime: string;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ selectedDay, selectedTime }) => {
  const { weatherData, isLoading, error, refreshWeather, getForecastForSlot } = useWeather();

  let displayWeather = getForecastForSlot(selectedDay, selectedTime) || weatherData;

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (error || !displayWeather) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
        <p className="text-gray-600 dark:text-gray-300">
          {error || 'Weather data unavailable'}
        </p>
        <button 
          onClick={() => refreshWeather()}
          className="mt-2 text-sm text-blue-600 dark:text-blue-400"
        >
          Retry
        </button>
      </div>
    );
  }

  const { main, weather, name, dt, sys, wind } = displayWeather;
  const temperature = Math.round(main.temp);
  const date = (displayWeather as any)?.dt_txt ? new Date((displayWeather as any).dt_txt) : new Date(dt * 1000);
  const isDay = date.getHours() > 6 && date.getHours() < 20;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <MapPin size={16} className="text-gray-500 dark:text-gray-400" />
              <h3 className="text-lg font-medium ml-1">
                {name}{sys?.country ? `, ${sys.country}` : ''}
              </h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {format(date, 'EEEE, MMM d')}
            </p>
          </div>
          <div className="text-4xl font-semibold">
            {getWeatherIcon(weather[0].id, isDay)}
          </div>
        </div>
        
        <div className="mt-3 flex items-center">
          <div className="text-3xl font-bold">{temperature}°C</div>
          <div className="ml-2 text-gray-600 dark:text-gray-300">
            <p className="text-sm capitalize">{weather[0].description}</p>
          </div>
        </div>
        
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Droplets size={16} className="mr-1" />
            <span>Humidity: {main.humidity}%</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Wind size={16} className="mr-1" />
            <span>Wind: {Math.round(wind.speed * 3.6)} km/h</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;