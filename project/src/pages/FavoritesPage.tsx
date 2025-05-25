import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ClothingItem from '../components/ClothingItem';
import OutfitItem from '../components/OutfitItem';
import { useCloset } from '../context/ClosetContext';
import { ClothingItem as ClothingItemType, Outfit } from '../services/db';

const FavoritesPage: React.FC = () => {
  const { 
    clothingItems, 
    outfits,
    toggleFavorite, 
    toggleOutfitFavorite,
    deleteClothingItem,
    deleteOutfit,
    isLoading 
  } = useCloset();
  
  const [activeTab, setActiveTab] = useState<'clothing' | 'outfits'>('clothing');
  
  // Get favorite items
  const favoriteClothing = clothingItems.filter(item => item.favorite);
  const favoriteOutfits = outfits.filter(outfit => outfit.favorite);
  
  // Find clothing items for outfits
  const findClothingItem = (id: string) => {
    return clothingItems.find(item => item.id === id);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mb-16"
    >
      <h1 className="text-2xl font-bold mb-6">My Favorites</h1>
      
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab('clothing')}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'clothing'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          Clothing Items
        </button>
        <button
          onClick={() => setActiveTab('outfits')}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'outfits'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          Outfits
        </button>
      </div>
      
      {activeTab === 'clothing' && (
        <>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              ))}
            </div>
          ) : favoriteClothing.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteClothing.map(item => (
                <ClothingItem
                  key={item.id}
                  item={item}
                  onToggleFavorite={toggleFavorite}
                  onDelete={deleteClothingItem}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                You don't have any favorite clothing items yet
              </p>
              <p className="mt-2 text-blue-600 dark:text-blue-400">
                Click the heart icon on items to add them to favorites
              </p>
            </div>
          )}
        </>
      )}
      
      {activeTab === 'outfits' && (
        <>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map(i => (
                <div key={i} className="animate-pulse h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              ))}
            </div>
          ) : favoriteOutfits.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favoriteOutfits.map(outfit => (
                <OutfitItem
                  key={outfit.id}
                  outfit={outfit}
                  topItem={findClothingItem(outfit.topId)}
                  bottomItem={findClothingItem(outfit.bottomId)}
                  onToggleFavorite={toggleOutfitFavorite}
                  onDelete={deleteOutfit}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                You don't have any favorite outfits yet
              </p>
              <p className="mt-2 text-blue-600 dark:text-blue-400">
                Click the heart icon on outfits to add them to favorites
              </p>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default FavoritesPage;