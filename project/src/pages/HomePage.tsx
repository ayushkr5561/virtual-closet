import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import WeatherWidget from '../components/WeatherWidget';
import ClothingItem from '../components/ClothingItem';
import { useCloset } from '../context/ClosetContext';
import { useWeather } from '../context/WeatherContext';
import { ClothingItem as ClothingItemType } from '../services/db';

const HomePage: React.FC = () => {
  const { clothingItems, toggleFavorite, isLoading: closetLoading } = useCloset();
  const { suggestedWeatherTag, weatherCondition } = useWeather();
  
  const [selectedDay, setSelectedDay] = useState<string>('today');
  const [selectedTime, setSelectedTime] = useState<string>('morning');
  const [topItems, setTopItems] = useState<ClothingItemType[]>([]);
  const [bottomItems, setBottomItems] = useState<ClothingItemType[]>([]);

  // Days of the week for selector
  const days = [
    { id: 'today', label: 'Today' },
    { id: 'mon', label: 'Mon' },
    { id: 'tue', label: 'Tue' },
    { id: 'wed', label: 'Wed' },
    { id: 'thu', label: 'Thu' },
    { id: 'fri', label: 'Fri' },
    { id: 'sat', label: 'Sat' },
    { id: 'sun', label: 'Sun' },
  ];

  // Times of day for selector
  const times = [
    { id: 'morning', label: 'Morning' },
    { id: 'afternoon', label: 'Afternoon' },
    { id: 'night', label: 'Night' },
  ];

  // Filter clothing based on weather and type
  useEffect(() => {
    if (clothingItems.length > 0) {
      // For demo purposes, we're only filtering by weather
      // In a real app, you might have more complex filtering logic based on day and time
      const filteredTops = clothingItems.filter(
        item => item.type === 'top' && item.weather === suggestedWeatherTag
      );
      const filteredBottoms = clothingItems.filter(
        item => item.type === 'bottom' && item.weather === suggestedWeatherTag
      );
      
      setTopItems(filteredTops);
      setBottomItems(filteredBottoms);
    }
  }, [clothingItems, suggestedWeatherTag, selectedDay, selectedTime]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <section className="mb-6">
        <WeatherWidget selectedDay={selectedDay} selectedTime={selectedTime} />
      </section>
      
      <section className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Calendar size={20} className="text-blue-600 dark:text-blue-400 mr-2" />
            <h2 className="text-lg font-medium">Day</h2>
          </div>
          
          <div className="overflow-x-auto hide-scrollbar">
            <div className="flex space-x-2">
              {days.map(day => (
                <button
                  key={day.id}
                  onClick={() => setSelectedDay(day.id)}
                  className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                    selectedDay === day.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Clock size={20} className="text-blue-600 dark:text-blue-400 mr-2" />
            <h2 className="text-lg font-medium">Time</h2>
          </div>
          
          <div className="flex space-x-2">
            {times.map(time => (
              <button
                key={time.id}
                onClick={() => setSelectedTime(time.id)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedTime === time.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}
              >
                {time.label}
              </button>
            ))}
          </div>
        </div>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Recommended Tops</h2>
        {closetLoading ? (
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse min-w-[180px] h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        ) : topItems.length > 0 ? (
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {topItems.map(item => (
              <ClothingItem
                key={item.id}
                item={item}
                onToggleFavorite={toggleFavorite}
                className="min-w-[180px] w-[180px]"
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-6">
            No matching tops found. Try adding some clothing items for {suggestedWeatherTag} weather.
          </p>
        )}
      </section>
      
      <section>
        <h2 className="text-xl font-semibold mb-4">Recommended Bottoms</h2>
        {closetLoading ? (
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse min-w-[180px] h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        ) : bottomItems.length > 0 ? (
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {bottomItems.map(item => (
              <ClothingItem
                key={item.id}
                item={item}
                onToggleFavorite={toggleFavorite}
                className="min-w-[180px] w-[180px]"
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-6">
            No matching bottoms found. Try adding some clothing items for {suggestedWeatherTag} weather.
          </p>
        )}
      </section>
    </motion.div>
  );
};

export default HomePage;