import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, PlusCircle, ShoppingBag, Heart, User } from 'lucide-react';
import { useUser } from '../context/UserContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for dark mode preference
  useEffect(() => {
    if (currentUser?.preferences?.darkMode) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, [currentUser]);

  // Get the current page for highlighting the active tab
  const currentPage = location.pathname.split('/')[1] || 'home';

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/home' },
    { id: 'add', icon: PlusCircle, label: 'Add', path: '/add' },
    { id: 'closet', icon: ShoppingBag, label: 'Closet', path: '/closet' },
    { id: 'favorites', icon: Heart, label: 'Favorites', path: '/favorites' },
    { id: 'profile', icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">Virtual Closet</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Navigation */}
      <nav className="sticky bottom-0 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-2">
          <div className="flex justify-between items-center">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              const Icon = item.icon;
              
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center py-3 px-4 transition-colors ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <Icon size={24} className={isActive ? 'animate-pulse-slow' : ''} />
                  <span className="text-xs mt-1">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Layout;