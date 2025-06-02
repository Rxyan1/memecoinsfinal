'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface LoginFormComponentProps {
  onSuccess?: () => void;
}

export default function LoginFormComponent({ onSuccess }: LoginFormComponentProps) {
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login(formData.username, formData.password);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Erreur lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div>
        <label className="block mb-1">Email ou nom d'utilisateur</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1">Mot de passe</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
        disabled={isLoading}
      >
        {isLoading ? "Chargement..." : "Se connecter"}
      </button>
    </form>
  );
}
