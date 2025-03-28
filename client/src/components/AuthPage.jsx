
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const AuthPage = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    if (isLogin) {
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        localStorage.setItem('user', email);
        onAuthSuccess(email);
        toast.success('Logged in successfully');
        navigate('/user');
      } else {
        toast.error('Invalid credentials');
      }
    } else {
      if (password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }
      const exists = users.find(u => u.email === email);
      if (exists) {
        toast.error('User already exists');
        return;
      }
      const newUser = { email, password };
      localStorage.setItem('users', JSON.stringify([...users, newUser]));
      localStorage.setItem('user', email);
      onAuthSuccess(email);
      toast.success('Registered successfully');
      navigate('/user');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <motion.div
        className="bg-gray-900 text-white p-6 rounded-xl w-full max-w-md shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {isLogin ? 'Login to Weather Today' : 'Register for Weather Today'}
          </h2>
          <button
            onClick={toggleMode}
            className="text-sm text-blue-400 hover:underline"
          >
            {isLogin ? 'Need an account?' : 'Already have an account?'}
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.form
            key={isLogin ? 'login' : 'register'}
            onSubmit={handleSubmit}
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="w-full p-2 rounded bg-gray-800 border border-gray-600 pr-16 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute top-2 right-3 text-sm text-blue-400"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition rounded p-2 font-medium"
            >
              {isLogin ? 'Log In' : 'Register'}
            </button>
          </motion.form>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AuthPage;
