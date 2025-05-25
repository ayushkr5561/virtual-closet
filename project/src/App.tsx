import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Pages
import SplashScreen from './pages/SplashScreen';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import AddItemPage from './pages/AddItemPage';
import ClosetPage from './pages/ClosetPage';
import FavoritesPage from './pages/FavoritesPage';
import ProfilePage from './pages/ProfilePage';

// Components
import Layout from './components/Layout';

// Context
import.meta.env.VITE_OPENWEATHER_API_KEY
import { UserProvider } from './context/UserContext';
import { ClosetProvider } from './context/ClosetContext';
import { WeatherProvider } from './context/WeatherContext';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('virtualClosetUser');
    if (user) {
      setIsAuthenticated(true);
    }

    // Hide splash screen after 2 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <UserProvider>
      <ClosetProvider>
        <WeatherProvider>
          <Router>
            <AnimatePresence mode="wait">
              {showSplash ? (
                <SplashScreen key="splash" />
              ) : (
                <Routes>
                  <Route 
                    path="/" 
                    element={
                      isAuthenticated ? (
                        <Navigate to="/home" replace />
                      ) : (
                        <AuthPage setIsAuthenticated={setIsAuthenticated} />
                      )
                    } 
                  />
                  <Route 
                    path="/home" 
                    element={
                      isAuthenticated ? (
                        <Layout>
                          <HomePage />
                        </Layout>
                      ) : (
                        <Navigate to="/" replace />
                      )
                    } 
                  />
                  <Route 
                    path="/add" 
                    element={
                      isAuthenticated ? (
                        <Layout>
                          <AddItemPage />
                        </Layout>
                      ) : (
                        <Navigate to="/" replace />
                      )
                    } 
                  />
                  <Route 
                    path="/closet" 
                    element={
                      isAuthenticated ? (
                        <Layout>
                          <ClosetPage />
                        </Layout>
                      ) : (
                        <Navigate to="/" replace />
                      )
                    } 
                  />
                  <Route 
                    path="/favorites" 
                    element={
                      isAuthenticated ? (
                        <Layout>
                          <FavoritesPage />
                        </Layout>
                      ) : (
                        <Navigate to="/" replace />
                      )
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      isAuthenticated ? (
                        <Layout>
                          <ProfilePage setIsAuthenticated={setIsAuthenticated} />
                        </Layout>
                      ) : (
                        <Navigate to="/" replace />
                      )
                    } 
                  />
                </Routes>
              )}
            </AnimatePresence>
          </Router>
        </WeatherProvider>
      </ClosetProvider>
    </UserProvider>
  );
}

export default App;