import React from 'react';
import { Heart, Edit, Trash } from 'lucide-react';
import { ClothingItem as ClothingItemType } from '../services/db';

interface ClothingItemProps {
  item: ClothingItemType;
  onToggleFavorite: (id: string) => void;
  onEdit?: (item: ClothingItemType) => void;
  onDelete?: (id: string) => void;
  onClick?: (item: ClothingItemType) => void;
  className?: string;
}

const ClothingItem: React.FC<ClothingItemProps> = ({
  item,
  onToggleFavorite,
  onEdit,
  onDelete,
  onClick,
  className = '',
}) => {
  const handleClick = () => {
    if (onClick) onClick(item);
  };

  // Determine tag classes
  const getTagClass = (tag: string) => {
    switch (tag) {
      case 'casual': return 'tag-casual';
      case 'formal': return 'tag-formal';
      case 'work': return 'tag-work';
      case 'sports': return 'tag-sports';
      case 'nightout': return 'tag-nightout';
      case 'lounge': return 'tag-lounge';
      case 'rainy': return 'tag-rainy';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
    }
  };

  const getWeatherTagClass = (weather: string) => {
    switch (weather) {
      case 'summer': return 'weather-tag-summer';
      case 'winter': return 'weather-tag-winter';
      case 'inbetween': return 'weather-tag-inbetween';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
    }
  };

  return (
    <div 
      className={`card relative flex flex-col ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick ? handleClick : undefined}
    >
      <div className="relative h-52 bg-gray-100 dark:bg-gray-700">
        <img 
          src={item.image} 
          alt={item.name || `${item.type} clothing item`}
          className="w-full h-full object-cover"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(item.id);
          }}
          className="absolute top-2 right-2 p-1 bg-white dark:bg-gray-800 rounded-full shadow-md"
        >
          <Heart
            size={20}
            fill={item.favorite ? '#f43f5e' : 'none'}
            className={item.favorite ? 'text-rose-500' : 'text-gray-400'}
          />
        </button>
      </div>
      
      <div className="p-3 flex flex-col flex-grow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{item.name || `${item.type.charAt(0).toUpperCase() + item.type.slice(1)}`}</h3>
            {item.brand && (
              <p className="text-xs text-gray-500 dark:text-gray-400">{item.brand}</p>
            )}
          </div>
          <span 
            className="inline-block w-5 h-5 rounded-full" 
            style={{ backgroundColor: item.color }}
          ></span>
        </div>

        <div className="mt-2 flex flex-wrap gap-1">
          <span className={`tag ${getWeatherTagClass(item.weather)}`}>{item.weather}</span>
          {item.styleTag.map((tag, index) => (
            <span key={index} className={`tag ${getTagClass(tag)}`}>
              {tag}
            </span>
          ))}
        </div>

        {item.notes && (
          <p className="mt-2 text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
            {item.notes}
          </p>
        )}

        {(onEdit || onDelete) && (
          <div className="mt-3 flex justify-end gap-2">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(item);
                }}
                className="p-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <Edit size={16} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
                className="p-1 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
              >
                <Trash size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClothingItem;