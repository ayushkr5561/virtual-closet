import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShirtIcon, User, Mail, Lock, AlertTriangle } from 'lucide-react';
import { useUser } from '../context/UserContext';

interface AuthPageProps {
  setIsAuthenticated: (value: boolean) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ setIsAuthenticated }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  
  const { login, signup, isLoading, error } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    
    if (!email || !password) {
      setValidationError('Email and password are required');
      return;
    }
    
    if (!isLogin) {
      if (!name) {
        setValidationError('Name is required');
        return;
      }
      
      if (password !== confirmPassword) {
        setValidationError('Passwords do not match');
        return;
      }
      
      if (password.length < 6) {
        setValidationError('Password must be at least 6 characters');
        return;
      }
      
      const success = await signup(name, email, password);
      if (success) {
        setIsAuthenticated(true);
      }
    } else {
      const success = await login(email, password);
      if (success) {
        setIsAuthenticated(true);
      }
    }
  };
  
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setValidationError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-500 to-blue-700 px-4 py-12">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-12">
            <div className="flex justify-center mb-8">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3">
                <ShirtIcon size={40} className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-8">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="mb-6">
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2" htmlFor="name">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-gray-500 dark:text-gray-400" />
                    </div>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input pl-10"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>
              )}
              
              <div className="mb-6">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2" htmlFor="email">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-500 dark:text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input pl-10"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-500 dark:text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pl-10"
                    placeholder="Enter your password"
                  />
                </div>
              </div>
              
              {!isLogin && (
                <div className="mb-6">
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-500 dark:text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="input pl-10"
                      placeholder="Confirm your password"
                    />
                  </div>
                </div>
              )}
              
              {(validationError || error) && (
                <div className="mb-6 flex items-center p-4 bg-red-50 dark:bg-red-900/30 rounded-lg">
                  <AlertTriangle size={18} className="text-red-500 dark:text-red-400 mr-2" />
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {validationError || error}
                  </p>
                </div>
              )}
              
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full py-3"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : isLogin ? 'Log In' : 'Sign Up'}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <button
                onClick={toggleMode}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Log in'}
              </button>
            </div>
          </div>
        </div>
        
        <p className="mt-8 text-center text-sm text-white">
          <span className="font-medium">Virtual Closet</span> - Your personal style assistant
        </p>
      </motion.div>
    </div>
  );
};

export default AuthPage;