import { openDB, DBSchema } from 'idb';

// Define database schema
interface ClosetDB extends DBSchema {
  users: {
    key: string;
    value: {
      id: string;
      name: string;
      email: string;
      gender?: string;
      preferences?: {
        darkMode: boolean;
        location?: string;
      };
    };
  };
  clothing: {
    key: string;
    value: {
      id: string;
      userId: string;
      name?: string;
      image: string; // Base64 string
      type: 'top' | 'bottom';
      weather: 'summer' | 'winter' | 'inbetween';
      color: string;
      styleTag: string[];
      brand?: string;
      notes?: string;
      favorite: boolean;
      createdAt: number;
    };
    indexes: {
      'by-user': string;
      'by-type': string;
      'by-weather': string;
      'by-favorite': [string, boolean];
    };
  };
  outfits: {
    key: string;
    value: {
      id: string;
      userId: string;
      name: string;
      topId: string;
      bottomId: string;
      tags: string[];
      favorite: boolean;
      createdAt: number;
    };
    indexes: {
      'by-user': string;
      'by-favorite': [string, boolean];
    };
  };
}

// Initialize the database
const dbPromise = openDB<ClosetDB>('virtualCloset', 1, {
  upgrade(db) {
    // Create users store
    if (!db.objectStoreNames.contains('users')) {
      db.createObjectStore('users', { keyPath: 'id' });
    }

    // Create clothing store
    if (!db.objectStoreNames.contains('clothing')) {
      const clothingStore = db.createObjectStore('clothing', { keyPath: 'id' });
      clothingStore.createIndex('by-user', 'userId');
      clothingStore.createIndex('by-type', 'type');
      clothingStore.createIndex('by-weather', 'weather');
      clothingStore.createIndex('by-favorite', ['userId', 'favorite']);
    }

    // Create outfits store
    if (!db.objectStoreNames.contains('outfits')) {
      const outfitsStore = db.createObjectStore('outfits', { keyPath: 'id' });
      outfitsStore.createIndex('by-user', 'userId');
      outfitsStore.createIndex('by-favorite', ['userId', 'favorite']);
    }
  }
});

// User operations
export const userService = {
  async createUser(user: Omit<ClosetDB['users']['value'], 'id'>) {
    const id = crypto.randomUUID();
    const db = await dbPromise;
    await db.add('users', { ...user, id });
    return id;
  },

  async getUser(id: string) {
    const db = await dbPromise;
    return db.get('users', id);
  },

  async updateUser(user: ClosetDB['users']['value']) {
    const db = await dbPromise;
    return db.put('users', user);
  },

  async deleteUser(id: string) {
    const db = await dbPromise;
    return db.delete('users', id);
  }
};

// Clothing operations
export const clothingService = {
  async addClothing(clothing: Omit<ClosetDB['clothing']['value'], 'id' | 'createdAt'>) {
    const id = crypto.randomUUID();
    const db = await dbPromise;
    const item = {
      ...clothing,
      id,
      favorite: false,
      createdAt: Date.now()
    };
    await db.add('clothing', item);
    return id;
  },

  async getClothing(id: string) {
    const db = await dbPromise;
    return db.get('clothing', id);
  },

  async getAllClothing(userId: string) {
    const db = await dbPromise;
    return db.getAllFromIndex('clothing', 'by-user', userId);
  },

  async getClothingByType(userId: string, type: 'top' | 'bottom') {
    const db = await dbPromise;
    const allUserClothing = await db.getAllFromIndex('clothing', 'by-user', userId);
    return allUserClothing.filter(item => item.type === type);
  },

  async getClothingByWeather(userId: string, weather: 'summer' | 'winter' | 'inbetween') {
    const db = await dbPromise;
    const allUserClothing = await db.getAllFromIndex('clothing', 'by-user', userId);
    return allUserClothing.filter(item => item.weather === weather);
  },

  async getFavorites(userId: string) {
    const db = await dbPromise;
    return db.getAllFromIndex('clothing', 'by-favorite', [userId, true]);
  },

  async updateClothing(clothing: ClosetDB['clothing']['value']) {
    const db = await dbPromise;
    return db.put('clothing', clothing);
  },

  async toggleFavorite(id: string) {
    const db = await dbPromise;
    const clothing = await db.get('clothing', id);
    if (clothing) {
      clothing.favorite = !clothing.favorite;
      return db.put('clothing', clothing);
    }
    return null;
  },

  async deleteClothing(id: string) {
    const db = await dbPromise;
    return db.delete('clothing', id);
  }
};

// Outfit operations
export const outfitService = {
  async createOutfit(outfit: Omit<ClosetDB['outfits']['value'], 'id' | 'createdAt'>) {
    const id = crypto.randomUUID();
    const db = await dbPromise;
    const newOutfit = {
      ...outfit,
      id,
      createdAt: Date.now()
    };
    await db.add('outfits', newOutfit);
    return id;
  },

  async getOutfit(id: string) {
    const db = await dbPromise;
    return db.get('outfits', id);
  },

  async getAllOutfits(userId: string) {
    const db = await dbPromise;
    return db.getAllFromIndex('outfits', 'by-user', userId);
  },

  async getFavoriteOutfits(userId: string) {
    const db = await dbPromise;
    return db.getAllFromIndex('outfits', 'by-favorite', [userId, true]);
  },

  async updateOutfit(outfit: ClosetDB['outfits']['value']) {
    const db = await dbPromise;
    return db.put('outfits', outfit);
  },

  async toggleFavorite(id: string) {
    const db = await dbPromise;
    const outfit = await db.get('outfits', id);
    if (outfit) {
      outfit.favorite = !outfit.favorite;
      return db.put('outfits', outfit);
    }
    return null;
  },

  async deleteOutfit(id: string) {
    const db = await dbPromise;
    return db.delete('outfits', id);
  }
};

export type User = ClosetDB['users']['value'];
export type ClothingItem = ClosetDB['clothing']['value'];
export type Outfit = ClosetDB['outfits']['value'];