const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export type WeatherData = {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  name: string;
  dt: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  wind: {
    speed: number;
  };
};

export type WeatherCondition = 'clear' | 'clouds' | 'rain' | 'snow' | 'extreme' | 'unknown';

export const getWeatherByCoords = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Weather data could not be fetched');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw error;
  }
};

export const getWeatherByCity = async (city: string): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Weather data could not be fetched');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw error;
  }
};

export const getWeatherCondition = (weatherId: number): WeatherCondition => {
  if (weatherId >= 200 && weatherId < 600) {
    return 'rain';
  } else if (weatherId >= 600 && weatherId < 700) {
    return 'snow';
  } else if (weatherId >= 800 && weatherId < 801) {
    return 'clear';
  } else if (weatherId >= 801 && weatherId < 900) {
    return 'clouds';
  } else if (weatherId >= 900) {
    return 'extreme';
  }
  return 'unknown';
};

export const getWeatherIcon = (weatherId: number, isDay: boolean): string => {
  const condition = getWeatherCondition(weatherId);
  
  switch (condition) {
    case 'clear':
      return isDay ? '☀️' : '🌙';
    case 'clouds':
      return isDay ? '⛅' : '☁️';
    case 'rain':
      return '🌧️';
    case 'snow':
      return '❄️';
    case 'extreme':
      return '⛈️';
    default:
      return '🌤️';
  }
};

export const getSuggestedWeatherTag = (temperature: number): 'summer' | 'winter' | 'inbetween' => {
  if (temperature > 25) {
    return 'summer';
  } else if (temperature < 10) {
    return 'winter';
  } else {
    return 'inbetween';
  }
};

export const getUserLocation = async (): Promise<{ lat: number; lon: number } | null> => {
  return new Promise((resolve) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        () => {
          // Instead of rejecting, resolve with null when geolocation is denied
          resolve(null);
        }
      );
    } else {
      // Instead of rejecting, resolve with null when geolocation is not supported
      resolve(null);
    }
  });
};

export type ForecastData = {
  list: Array<WeatherData & { dt_txt: string }>;
  city: {
    name: string;
    country: string;
  };
};

export const getForecastByCity = async (city: string): Promise<ForecastData> => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error('Forecast data could not be fetched');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw error;
  }
};

export const getForecastByCoords = async (lat: number, lon: number): Promise<ForecastData> => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error('Forecast data could not be fetched');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw error;
  }
};