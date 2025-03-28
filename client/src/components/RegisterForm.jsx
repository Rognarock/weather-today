import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const RegisterForm = ({ onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const exists = users.find(u => u.email === email);
    if (exists) {
      toast.error('User already exists');
      return;
    }

    const newUser = { email, password };
    localStorage.setItem('users', JSON.stringify([...users, newUser]));
    localStorage.setItem('user', email);

    onRegister(email);
    toast.success('Registration successful!');
    navigate('/user');
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white pr-16"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute top-2 right-3 text-sm text-blue-400"
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
      >
        Register
      </button>
    </form>
  );
};

export default RegisterForm;
