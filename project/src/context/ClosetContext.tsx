import React, { createContext, useContext, useState, useEffect } from 'react';
import { clothingService, outfitService, ClothingItem, Outfit } from '../services/db';
import { useUser } from './UserContext';

interface ClosetContextType {
  clothingItems: ClothingItem[];
  outfits: Outfit[];
  isLoading: boolean;
  error: string | null;
  addClothingItem: (item: Omit<ClothingItem, 'id' | 'userId' | 'favorite' | 'createdAt'>) => Promise<string>;
  updateClothingItem: (item: ClothingItem) => Promise<void>;
  deleteClothingItem: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  getFavorites: () => Promise<ClothingItem[]>;
  getByType: (type: 'top' | 'bottom') => Promise<ClothingItem[]>;
  getByWeather: (weather: 'summer' | 'winter' | 'inbetween') => Promise<ClothingItem[]>;
  createOutfit: (name: string, topId: string, bottomId: string, tags: string[]) => Promise<string>;
  updateOutfit: (outfit: Outfit) => Promise<void>;
  deleteOutfit: (id: string) => Promise<void>;
  toggleOutfitFavorite: (id: string) => Promise<void>;
  getFavoriteOutfits: () => Promise<Outfit[]>;
  refreshCloset: () => Promise<void>;
}

const ClosetContext = createContext<ClosetContextType | undefined>(undefined);

export const ClosetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useUser();
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      refreshCloset();
    } else {
      setClothingItems([]);
      setOutfits([]);
    }
  }, [currentUser]);

  const refreshCloset = async () => {
    if (!currentUser) return;
    
    try {
      setIsLoading(true);
      const [clothes, userOutfits] = await Promise.all([
        clothingService.getAllClothing(currentUser.id),
        outfitService.getAllOutfits(currentUser.id)
      ]);
      
      setClothingItems(clothes);
      setOutfits(userOutfits);
    } catch (err) {
      console.error('Error loading closet data:', err);
      setError('Failed to load your closet');
    } finally {
      setIsLoading(false);
    }
  };

  const addClothingItem = async (item: Omit<ClothingItem, 'id' | 'userId' | 'favorite' | 'createdAt'>) => {
    if (!currentUser) throw new Error('User not authenticated');
    
    try {
      setIsLoading(true);
      const id = await clothingService.addClothing({
        ...item,
        userId: currentUser.id,
      });
      
      await refreshCloset();
      return id;
    } catch (err) {
      console.error('Error adding clothing item:', err);
      setError('Failed to add clothing item');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateClothingItem = async (item: ClothingItem) => {
    if (!currentUser) throw new Error('User not authenticated');
    
    try {
      setIsLoading(true);
      await clothingService.updateClothing(item);
      await refreshCloset();
    } catch (err) {
      console.error('Error updating clothing item:', err);
      setError('Failed to update clothing item');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteClothingItem = async (id: string) => {
    try {
      setIsLoading(true);
      await clothingService.deleteClothing(id);
      
      // Also delete any outfits using this item
      const outfitsToDelete = outfits.filter(
        outfit => outfit.topId === id || outfit.bottomId === id
      );
      
      for (const outfit of outfitsToDelete) {
        await outfitService.deleteOutfit(outfit.id);
      }
      
      await refreshCloset();
    } catch (err) {
      console.error('Error deleting clothing item:', err);
      setError('Failed to delete clothing item');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = async (id: string) => {
    try {
      setIsLoading(true);
      await clothingService.toggleFavorite(id);
      await refreshCloset();
    } catch (err) {
      console.error('Error toggling favorite:', err);
      setError('Failed to update favorite status');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getFavorites = async () => {
    if (!currentUser) return [];
    
    try {
      return await clothingService.getFavorites(currentUser.id);
    } catch (err) {
      console.error('Error getting favorites:', err);
      setError('Failed to get favorites');
      return [];
    }
  };

  const getByType = async (type: 'top' | 'bottom') => {
    if (!currentUser) return [];
    
    try {
      return await clothingService.getClothingByType(currentUser.id, type);
    } catch (err) {
      console.error(`Error getting ${type} items:`, err);
      setError(`Failed to get ${type} items`);
      return [];
    }
  };

  const getByWeather = async (weather: 'summer' | 'winter' | 'inbetween') => {
    if (!currentUser) return [];
    
    try {
      return await clothingService.getClothingByWeather(currentUser.id, weather);
    } catch (err) {
      console.error(`Error getting ${weather} items:`, err);
      setError(`Failed to get ${weather} items`);
      return [];
    }
  };

  const createOutfit = async (name: string, topId: string, bottomId: string, tags: string[]) => {
    if (!currentUser) throw new Error('User not authenticated');
    
    try {
      setIsLoading(true);
      const id = await outfitService.createOutfit({
        userId: currentUser.id,
        name,
        topId,
        bottomId,
        tags,
        favorite: false
      });
      
      await refreshCloset();
      return id;
    } catch (err) {
      console.error('Error creating outfit:', err);
      setError('Failed to create outfit');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateOutfit = async (outfit: Outfit) => {
    try {
      setIsLoading(true);
      await outfitService.updateOutfit(outfit);
      await refreshCloset();
    } catch (err) {
      console.error('Error updating outfit:', err);
      setError('Failed to update outfit');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteOutfit = async (id: string) => {
    try {
      setIsLoading(true);
      await outfitService.deleteOutfit(id);
      await refreshCloset();
    } catch (err) {
      console.error('Error deleting outfit:', err);
      setError('Failed to delete outfit');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOutfitFavorite = async (id: string) => {
    try {
      setIsLoading(true);
      await outfitService.toggleFavorite(id);
      await refreshCloset();
    } catch (err) {
      console.error('Error toggling outfit favorite:', err);
      setError('Failed to update outfit favorite status');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getFavoriteOutfits = async () => {
    if (!currentUser) return [];
    
    try {
      return await outfitService.getFavoriteOutfits(currentUser.id);
    } catch (err) {
      console.error('Error getting favorite outfits:', err);
      setError('Failed to get favorite outfits');
      return [];
    }
  };

  return (
    <ClosetContext.Provider
      value={{
        clothingItems,
        outfits,
        isLoading,
        error,
        addClothingItem,
        updateClothingItem,
        deleteClothingItem,
        toggleFavorite,
        getFavorites,
        getByType,
        getByWeather,
        createOutfit,
        updateOutfit,
        deleteOutfit,
        toggleOutfitFavorite,
        getFavoriteOutfits,
        refreshCloset
      }}
    >
      {children}
    </ClosetContext.Provider>
  );
};

export const useCloset = (): ClosetContextType => {
  const context = useContext(ClosetContext);
  if (context === undefined) {
    throw new Error('useCloset must be used within a ClosetProvider');
  }
  return context;
};