import React from 'react';
import { Heart, Edit, Trash } from 'lucide-react';
import { Outfit, ClothingItem } from '../services/db';

interface OutfitItemProps {
  outfit: Outfit;
  topItem: ClothingItem | undefined;
  bottomItem: ClothingItem | undefined;
  onToggleFavorite: (id: string) => void;
  onEdit?: (outfit: Outfit) => void;
  onDelete?: (id: string) => void;
  onClick?: (outfit: Outfit) => void;
  className?: string;
}

const OutfitItem: React.FC<OutfitItemProps> = ({
  outfit,
  topItem,
  bottomItem,
  onToggleFavorite,
  onEdit,
  onDelete,
  onClick,
  className = '',
}) => {
  const handleClick = () => {
    if (onClick) onClick(outfit);
  };

  // Handle missing items
  if (!topItem || !bottomItem) {
    return (
      <div className="card p-4">
        <h3 className="font-medium">{outfit.name}</h3>
        <p className="text-sm text-red-500">
          {!topItem && !bottomItem 
            ? 'Top and bottom items not found' 
            : !topItem 
              ? 'Top item not found' 
              : 'Bottom item not found'
          }
        </p>
        <div className="mt-3 flex justify-end gap-2">
          {onDelete && (
            <button
              onClick={() => onDelete(outfit.id)}
              className="p-1 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
            >
              <Trash size={16} />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`card relative ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick ? handleClick : undefined}
    >
      <div className="flex flex-col sm:flex-row">
        <div className="w-full sm:w-1/2 h-40 bg-gray-100 dark:bg-gray-700">
          <img 
            src={topItem.image} 
            alt={`Top: ${topItem.name || 'Top item'}`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full sm:w-1/2 h-40 bg-gray-100 dark:bg-gray-700">
          <img 
            src={bottomItem.image} 
            alt={`Bottom: ${bottomItem.name || 'Bottom item'}`}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      <div className="p-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{outfit.name}</h3>
            <div className="mt-1 flex flex-wrap gap-1">
              {outfit.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100 text-xs px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(outfit.id);
            }}
            className="p-1"
          >
            <Heart
              size={20}
              fill={outfit.favorite ? '#f43f5e' : 'none'}
              className={outfit.favorite ? 'text-rose-500' : 'text-gray-400'}
            />
          </button>
        </div>

        {(onEdit || onDelete) && (
          <div className="mt-3 flex justify-end gap-2">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(outfit);
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
                  onDelete(outfit.id);
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

export default OutfitItem;