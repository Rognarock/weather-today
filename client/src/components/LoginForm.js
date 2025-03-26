import React, { useState } from "react";

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    localStorage.setItem("user", email);
    onLogin(email);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow space-y-4"
    >
      <h2 className="text-2xl font-bold text-center">Sign In</h2>
      <input
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-3 py-2 border rounded dark:bg-gray-700"
        required
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Log In
      </button>
    </form>
  );
};

export default LoginForm;
