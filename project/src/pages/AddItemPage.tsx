import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, X, Plus, CheckCircle } from 'lucide-react';
import { useCloset } from '../context/ClosetContext';
import { useNavigate } from 'react-router-dom';

const AddItemPage: React.FC = () => {
  const { addClothingItem, isLoading } = useCloset();
  const navigate = useNavigate();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState<'top' | 'bottom'>('top');
  const [weather, setWeather] = useState<'summer' | 'winter' | 'inbetween'>('summer');
  const [color, setColor] = useState('#000000');
  const [styleTags, setStyleTags] = useState<string[]>([]);
  const [brand, setBrand] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  // Available style tags
  const availableTags = ['casual', 'formal', 'work', 'sports', 'nightout', 'lounge', 'rainy'];

  // Handle image upload
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      setError('');
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    maxFiles: 1
  });

  // Toggle style tag selection
  const toggleTag = (tag: string) => {
    if (styleTags.includes(tag)) {
      setStyleTags(styleTags.filter(t => t !== tag));
    } else {
      setStyleTags([...styleTags, tag]);
    }
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imagePreview) {
      setError('Please upload an image');
      return;
    }
    
    if (styleTags.length === 0) {
      setError('Please select at least one style tag');
      return;
    }
    
    try {
      await addClothingItem({
        name,
        type,
        weather,
        color,
        styleTag: styleTags,
        brand: brand || undefined,
        notes: notes || undefined,
        image: imagePreview,
      });
      
      navigate('/closet');
    } catch (err) {
      console.error('Error adding item:', err);
      setError('Failed to add item to your closet');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mb-16"
    >
      <h1 className="text-2xl font-bold mb-6">Add Clothing Item</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="card mb-6">
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-300 dark:border-gray-700'
            }`}
          >
            <input {...getInputProps()} />
            
            {imagePreview ? (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="max-h-64 mx-auto rounded-lg" 
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImagePreview(null);
                  }}
                  className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md"
                >
                  <X size={16} className="text-gray-700 dark:text-gray-300" />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Drag & drop an image here, or click to select
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="card p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name (Optional)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="E.g., Blue Jeans, Red T-shirt"
              className="input"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setType('top')}
                className={`flex-1 py-2 px-4 rounded-lg border ${
                  type === 'top'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700'
                }`}
              >
                Top
              </button>
              <button
                type="button"
                onClick={() => setType('bottom')}
                className={`flex-1 py-2 px-4 rounded-lg border ${
                  type === 'bottom'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700'
                }`}
              >
                Bottom
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Weather Suitability
            </label>
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setWeather('summer')}
                className={`py-2 px-4 rounded-lg border ${
                  weather === 'summer'
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700'
                }`}
              >
                Summer
              </button>
              <button
                type="button"
                onClick={() => setWeather('inbetween')}
                className={`py-2 px-4 rounded-lg border ${
                  weather === 'inbetween'
                    ? 'bg-teal-500 text-white border-teal-500'
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700'
                }`}
              >
                In-between
              </button>
              <button
                type="button"
                onClick={() => setWeather('winter')}
                className={`py-2 px-4 rounded-lg border ${
                  weather === 'winter'
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700'
                }`}
              >
                Winter
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Style Tags
            </label>
            <div className="flex gap-2 flex-wrap">
              {availableTags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`py-2 px-4 rounded-lg border relative ${
                    styleTags.includes(tag)
                      ? `tag-${tag} border-transparent`
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700'
                  }`}
                >
                  {styleTags.includes(tag) && (
                    <CheckCircle size={16} className="absolute top-1 right-1" />
                  )}
                  <span className="capitalize">{tag}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Color
            </label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-10 w-full rounded-lg cursor-pointer"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Brand (Optional)
            </label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="E.g., Nike, Zara"
              className="input"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional details about this item"
              className="input h-24 resize-none"
            />
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding Item...
            </>
          ) : (
            <>
              <Plus size={20} className="mr-2" />
              Add to Closet
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default AddItemPage;