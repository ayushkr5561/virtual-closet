import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Moon, Sun, MapPin, Download, Upload, LogOut, RefreshCw, AlertTriangle } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useWeather } from '../context/WeatherContext';

interface ProfilePageProps {
  setIsAuthenticated: (value: boolean) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ setIsAuthenticated }) => {
  const { currentUser, updateUserProfile, logout } = useUser();
  const { updateLocation } = useWeather();
  
  const [name, setName] = useState(currentUser?.name || '');
  const [location, setLocation] = useState(currentUser?.preferences?.location || '');
  const [gender, setGender] = useState(currentUser?.gender || '');
  const [darkMode, setDarkMode] = useState(currentUser?.preferences?.darkMode || false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  
  // Update form when user data changes
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setLocation(currentUser.preferences?.location || '');
      setGender(currentUser.gender || '');
      setDarkMode(currentUser.preferences?.darkMode || false);
    }
  }, [currentUser]);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateUserProfile({
        ...currentUser!,
        name,
        gender: gender || undefined,
        preferences: {
          ...currentUser!.preferences,
          darkMode,
          location: location || undefined
        }
      });
      
      // Update weather location if provided
      if (location) {
        try {
          await updateLocation(location);
        } catch (weatherErr) {
          setError('Failed to update weather location. Please check the city name.');
          return;
        }
      }
      
      setMessage('Profile updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
  };
  
  // Handle dark mode toggle
  const toggleDarkMode = async () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    // Update in DOM immediately for better UX
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save to user preferences
    if (currentUser) {
      await updateUserProfile({
        ...currentUser,
        preferences: {
          ...currentUser.preferences,
          darkMode: newDarkMode
        }
      });
    }
  };
  
  // Handle data export
  const handleExportData = async () => {
    try {
      // This is a simplified version - in a real app you'd get all user data from IndexedDB
      const userDataStr = localStorage.getItem('virtualClosetUser');
      
      if (!userDataStr) {
        setError('No user data found');
        return;
      }
      
      // Create a blob and download it
      const dataStr = JSON.stringify({ userData: JSON.parse(userDataStr) });
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'virtual-closet-data.json';
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setMessage('Data exported successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error exporting data:', err);
      setError('Failed to export data');
    }
  };
  
  // Handle reset data
  const handleResetData = () => {
    setShowConfirmReset(true);
  };
  
  const confirmResetData = () => {
    try {
      localStorage.clear();
      // In a real app, you'd also clear IndexedDB data here
      
      setShowConfirmReset(false);
      setMessage('Data reset successfully. Please log in again.');
      
      // Log out after a brief delay
      setTimeout(() => {
        logout();
        setIsAuthenticated(false);
      }, 2000);
    } catch (err) {
      console.error('Error resetting data:', err);
      setError('Failed to reset data');
      setShowConfirmReset(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mb-16"
    >
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      
      <div className="card p-6 mb-6">
        <div className="flex items-center mb-6">
          <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-4">
            <User size={32} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-semibold">{currentUser?.name}</h2>
            <p className="text-gray-600 dark:text-gray-400">{currentUser?.email}</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Gender (Optional)
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="input"
            >
              <option value="">Prefer not to say</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
              <MapPin size={16} className="mr-1" />
              Weather Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="E.g., New York, London"
              className="input"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Enter a city name for weather-based outfit recommendations
            </p>
          </div>
          
          <button type="submit" className="btn btn-primary w-full">
            Save Changes
          </button>
        </form>
      </div>
      
      <div className="card p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Settings</h2>
        
        <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            {darkMode ? (
              <Moon size={20} className="text-blue-600 dark:text-blue-400 mr-3" />
            ) : (
              <Sun size={20} className="text-blue-600 dark:text-blue-400 mr-3" />
            )}
            <span>Dark Mode</span>
          </div>
          <button 
            onClick={toggleDarkMode}
            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
              darkMode ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                darkMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Download size={20} className="text-blue-600 dark:text-blue-400 mr-3" />
            <span>Export Data</span>
          </div>
          <button 
            onClick={handleExportData}
            className="text-blue-600 dark:text-blue-400 font-medium"
          >
            Export
          </button>
        </div>
        
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center">
            <RefreshCw size={20} className="text-red-500 mr-3" />
            <span>Reset Data</span>
          </div>
          <button 
            onClick={handleResetData}
            className="text-red-500 font-medium"
          >
            Reset
          </button>
        </div>
      </div>
      
      <button
        onClick={handleLogout}
        className="flex items-center justify-center w-full py-3 px-4 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <LogOut size={20} className="mr-2" />
        Log Out
      </button>
      
      {message && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
          {message}
        </div>
      )}
      
      {error && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
          <AlertTriangle size={16} className="mr-2" />
          {error}
        </div>
      )}
      
      {showConfirmReset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold mb-2">Confirm Reset</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This will delete all your data including clothing items and outfits. This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={confirmResetData}
                className="btn bg-red-600 text-white hover:bg-red-700"
              >
                Reset All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProfilePage;