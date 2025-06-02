'use client';

import { useState, useEffect } from 'react';

interface MarketStatsProps {
  className?: string;
}

interface MarketData {
  totalZth: number;
  totalPspCoins: number;
  pspSupply: number;
  zthReserve: number;
  currentPrice: number;
  formattedPrice: string;
}

export default function MarketStats({ className = '' }: MarketStatsProps) {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMarketStats() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/market-stats');
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Erreur lors de la récupération des statistiques');
        }

        setMarketData(result.data);
      } catch (err: any) {
        setError(err.message || 'Une erreur est survenue');
        console.error('Error fetching market stats:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMarketStats();
  }, []);

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 mt-4 ${className}`}>
        <h2 className="text-xl font-bold mb-4">Statistiques du marché</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">Chargement...</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 mt-4 ${className}`}>
        <h2 className="text-xl font-bold mb-4">Statistiques du marché</h2>
        <div className="text-red-500 text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 mt-4 ${className}`}>
      <h2 className="text-xl font-bold mb-4">Statistiques du marché</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-lg font-bold">{marketData?.totalZth} ZTH</p>
          <p className="text-sm text-gray-600">ZTH total</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-lg font-bold">{marketData?.totalPspCoins} PSP Coins</p>
          <p className="text-sm text-gray-600">PSP Coins total</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-lg font-bold">{marketData?.pspSupply} PSP</p>
          <p className="text-sm text-gray-600">Supply en circulation</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-lg font-bold">{marketData?.formattedPrice} ZTH</p>
          <p className="text-sm text-gray-600">Prix actuel/PSP Coin</p>
        </div>
      </div>
    </div>
  );
}
