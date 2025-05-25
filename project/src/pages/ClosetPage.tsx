import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, PlusCircle, X, Filter } from 'lucide-react';
import ClothingItem from '../components/ClothingItem';
import OutfitItem from '../components/OutfitItem';
import { useCloset } from '../context/ClosetContext';
import { ClothingItem as ClothingItemType, Outfit } from '../services/db';

const ClosetPage: React.FC = () => {
  const { 
    clothingItems, 
    outfits, 
    toggleFavorite, 
    toggleOutfitFavorite,
    deleteClothingItem,
    deleteOutfit,
    createOutfit,
    isLoading 
  } = useCloset();

  const [activeTab, setActiveTab] = useState<'clothing' | 'outfits'>('clothing');
  const [showCreateOutfit, setShowCreateOutfit] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'top' | 'bottom'>('all');
  const [filterWeather, setFilterWeather] = useState<'all' | 'summer' | 'winter' | 'inbetween'>('all');
  
  // Create outfit state
  const [outfitName, setOutfitName] = useState('');
  const [selectedTop, setSelectedTop] = useState<string>('');
  const [selectedBottom, setSelectedBottom] = useState<string>('');
  const [outfitTags, setOutfitTags] = useState<string[]>([]);
  const [createError, setCreateError] = useState('');

  // Filter clothing items
  const filteredClothing = clothingItems.filter(item => {
    // Search term filter
    const matchesSearch = 
      searchTerm === '' || 
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.styleTag.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Type filter
    const matchesType = filterType === 'all' || item.type === filterType;
    
    // Weather filter
    const matchesWeather = filterWeather === 'all' || item.weather === filterWeather;
    
    return matchesSearch && matchesType && matchesWeather;
  });

  // Filter outfits
  const filteredOutfits = outfits.filter(outfit => {
    // Search term filter
    return searchTerm === '' || 
      outfit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      outfit.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  // Create a new outfit
  const handleCreateOutfit = async () => {
    if (!outfitName) {
      setCreateError('Please enter a name for your outfit');
      return;
    }
    
    if (!selectedTop) {
      setCreateError('Please select a top');
      return;
    }
    
    if (!selectedBottom) {
      setCreateError('Please select a bottom');
      return;
    }
    
    try {
      await createOutfit(outfitName, selectedTop, selectedBottom, outfitTags);
      
      // Reset form
      setOutfitName('');
      setSelectedTop('');
      setSelectedBottom('');
      setOutfitTags([]);
      setShowCreateOutfit(false);
      setCreateError('');
    } catch (err) {
      console.error('Error creating outfit:', err);
      setCreateError('Failed to create outfit');
    }
  };

  // Toggle outfit tag selection
  const toggleOutfitTag = (tag: string) => {
    if (outfitTags.includes(tag)) {
      setOutfitTags(outfitTags.filter(t => t !== tag));
    } else {
      setOutfitTags([...outfitTags, tag]);
    }
  };

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Closet</h1>
        
        {activeTab === 'outfits' && (
          <button
            onClick={() => setShowCreateOutfit(true)}
            className="btn btn-primary flex items-center"
          >
            <PlusCircle size={18} className="mr-1" />
            Create Outfit
          </button>
        )}
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-500 dark:text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={`Search ${activeTab === 'clothing' ? 'items' : 'outfits'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10 pr-10"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X size={18} className="text-gray-500 dark:text-gray-400" />
            </button>
          )}
        </div>
      </div>
      
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
          <div className="mb-6 flex flex-wrap gap-2">
            <div className="flex items-center">
              <Filter size={16} className="text-gray-500 dark:text-gray-400 mr-2" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Filters:</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'top' | 'bottom')}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-sm px-3 py-1"
              >
                <option value="all">All Types</option>
                <option value="top">Tops</option>
                <option value="bottom">Bottoms</option>
              </select>
              
              <select
                value={filterWeather}
                onChange={(e) => setFilterWeather(e.target.value as 'all' | 'summer' | 'winter' | 'inbetween')}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-sm px-3 py-1"
              >
                <option value="all">All Weather</option>
                <option value="summer">Summer</option>
                <option value="inbetween">In-between</option>
                <option value="winter">Winter</option>
              </select>
            </div>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="animate-pulse h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              ))}
            </div>
          ) : filteredClothing.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClothing.map(item => (
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
                {searchTerm || filterType !== 'all' || filterWeather !== 'all'
                  ? 'No items match your filters'
                  : 'Your closet is empty'}
              </p>
              {!searchTerm && filterType === 'all' && filterWeather === 'all' && (
                <p className="mt-2 text-blue-600 dark:text-blue-400">
                  Add some clothing items to get started
                </p>
              )}
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
          ) : filteredOutfits.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredOutfits.map(outfit => (
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
                {searchTerm
                  ? 'No outfits match your search'
                  : 'You haven\'t created any outfits yet'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowCreateOutfit(true)}
                  className="mt-4 btn btn-primary"
                >
                  Create Your First Outfit
                </button>
              )}
            </div>
          )}
        </>
      )}
      
      {/* Create Outfit Modal */}
      {showCreateOutfit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Create New Outfit</h2>
                <button onClick={() => setShowCreateOutfit(false)}>
                  <X size={24} className="text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Outfit Name
                </label>
                <input
                  type="text"
                  value={outfitName}
                  onChange={(e) => setOutfitName(e.target.value)}
                  className="input"
                  placeholder="E.g., Casual Friday, Summer Party"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Select Top
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border border-gray-200 dark:border-gray-700 rounded-lg">
                  {clothingItems
                    .filter(item => item.type === 'top')
                    .map(item => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedTop(item.id)}
                        className={`relative border rounded-lg overflow-hidden cursor-pointer ${
                          selectedTop === item.id
                            ? 'border-blue-500 ring-2 ring-blue-500'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <img
                          src={item.image}
                          alt={item.name || 'Top item'}
                          className="w-full h-20 object-cover"
                        />
                      </div>
                    ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Select Bottom
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border border-gray-200 dark:border-gray-700 rounded-lg">
                  {clothingItems
                    .filter(item => item.type === 'bottom')
                    .map(item => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedBottom(item.id)}
                        className={`relative border rounded-lg overflow-hidden cursor-pointer ${
                          selectedBottom === item.id
                            ? 'border-blue-500 ring-2 ring-blue-500'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <img
                          src={item.image}
                          alt={item.name || 'Bottom item'}
                          className="w-full h-20 object-cover"
                        />
                      </div>
                    ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tags (Optional)
                </label>
                <div className="flex flex-wrap gap-2">
                  {['casual', 'formal', 'work', 'date', 'vacation', 'special'].map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleOutfitTag(tag)}
                      className={`py-1 px-3 rounded-full text-xs ${
                        outfitTags.includes(tag)
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              
              {createError && (
                <div className="mb-4 text-sm text-red-600 dark:text-red-400">
                  {createError}
                </div>
              )}
              
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateOutfit(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateOutfit}
                  className="btn btn-primary"
                >
                  Create Outfit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ClosetPage;