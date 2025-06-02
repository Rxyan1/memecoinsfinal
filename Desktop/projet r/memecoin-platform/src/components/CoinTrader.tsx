'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getBuyCost, getSellReturn, getCurrentPrice } from '../utils/bondingCurve';

interface CoinTraderProps {
  onSuccess?: () => void;
}

export default function CoinTrader({ onSuccess }: CoinTraderProps) {
  const { user, setUser } = useAuth();
  const [amount, setAmount] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [marketStats, setMarketStats] = useState<any>(null);
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);
  const [estimatedReturn, setEstimatedReturn] = useState<number | null>(null);

  useEffect(() => {
    // Fetch current price and market stats when component mounts
    fetchCurrentPrice();
  }, []);

  useEffect(() => {
    // Recalculate estimates when amount or market stats change
    if (marketStats && amount > 0) {
      // Calculate buy cost estimate
      const buyCost = getBuyCost(marketStats.pspSupply, amount);
      setEstimatedCost(Math.ceil(buyCost));
      
      // Calculate sell return estimate
      const sellReturn = getSellReturn(marketStats.pspSupply, amount);
      // Check if the return would be more than the reserve
      const safeReturn = Math.min(Math.floor(sellReturn), marketStats.zthReserve);
      setEstimatedReturn(safeReturn);
    }
  }, [amount, marketStats]);

  const fetchCurrentPrice = async () => {
    try {
      const response = await fetch('/api/market-stats');
      const data = await response.json();
      
      if (data.success) {
        setCurrentPrice(data.data.currentPrice);
        setMarketStats(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch price:', err);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setAmount(value > 0 ? value : 1);
  };

  const handleTransaction = async (action: 'buy' | 'sell') => {
    if (!user) {
      setError('Vous devez être connecté pour effectuer cette action');
      return;
    }
    
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.id,
          action,
          amount
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la transaction');
      }
      
      // Mise à jour du contexte utilisateur avec les nouvelles valeurs
      setUser(data.user);
      setSuccessMessage(data.message);
      
      // Update the market stats and price after transaction
      setMarketStats(data.marketStats);
      fetchCurrentPrice();
      
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-xl p-6 border border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-white">Échange de PSP Coins</h2>
      <div className="mb-4">
        <p className="text-sm text-gray-300 mb-2">Taux d'échange: 1 ZTH = 1 PSP Coin</p>
        
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-gray-900 p-3 rounded-lg flex-1">
            <label htmlFor="amount" className="text-gray-400 text-sm block mb-1">Montant</label>
            <div className="flex items-center">
              <input
                id="amount"
                type="number"
                min="1"
                value={amount}
                onChange={handleAmountChange}
                className="bg-transparent text-white w-full focus:outline-none text-lg"
              />
              <span className="text-gray-400">coins</span>
            </div>
          </div>
        </div>

        {user && (
          <div className="flex justify-between items-center bg-gray-900 p-4 rounded-lg mb-4">
            <div>
              <p className="text-sm text-gray-400">Votre solde</p>
              <p className="text-white font-medium">{user.zth} ZTH</p>
            </div>
            <div className="h-12 w-px bg-gray-700"></div>
            <div>
              <p className="text-sm text-gray-400">PSP Coins</p>
              <p className="text-white font-medium">{user.pspCoins} PSP</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleTransaction('buy')}
            disabled={isLoading || !user || user.zth < amount}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Chargement...
              </span>
            ) : 'Acheter des PSP Coins'}
          </button>
          <button
            onClick={() => handleTransaction('sell')}
            disabled={isLoading || !user || user.pspCoins < amount}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Chargement...
              </span>
            ) : 'Vendre des PSP Coins'}
          </button>
        </div>

        {error && (
          <div className="mt-4 bg-red-900/30 border border-red-500/50 text-red-200 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="mt-4 bg-green-900/30 border border-green-500/50 text-green-200 p-3 rounded-lg text-sm">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
}
