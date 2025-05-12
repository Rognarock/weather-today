import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { toast } from "react-toastify";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Registered successfully!");
    } catch (err) {
      toast.error("Registration failed.");
    }
  };

  return (
    <form
      onSubmit={handleRegister}
      className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-80 space-y-4"
    >
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 rounded border dark:border-gray-600 placeholder:text-gray-500 dark:placeholder:text-gray-400"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-3 rounded border dark:border-gray-600 placeholder:text-gray-500 dark:placeholder:text-gray-400"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded"
      >
        Register
      </button>
    </form>
  );
}

