'use client';

import { useState } from 'react';

export default function AdminMarketTools() {
  const [amount, setAmount] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleAddToReserve = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const response = await fetch('/api/market-stats/seed-reserve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue');
      }
      
      setSuccessMessage(data.message);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Outils d'administration du marché</h2>
      <div className="mb-4">
        <label htmlFor="amount" className="block mb-2 text-sm font-medium">
          Montant de ZTH à ajouter à la réserve:
        </label>
        <input
          id="amount"
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
          className="border rounded px-3 py-2 w-full"
        />
      </div>
      
      <button
        onClick={handleAddToReserve}
        disabled={isLoading || amount <= 0}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isLoading ? 'Chargement...' : 'Ajouter à la réserve'}
      </button>
      
      {error && (
        <div className="mt-4 text-red-500 text-sm">{error}</div>
      )}
      
      {successMessage && (
        <div className="mt-4 text-green-500 text-sm">{successMessage}</div>
      )}
    </div>
  );
}
