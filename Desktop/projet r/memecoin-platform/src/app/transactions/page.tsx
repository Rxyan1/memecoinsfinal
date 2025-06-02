'use client';

import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import CoinTrader from '../../components/CoinTrader';
import Link from 'next/link';
import MarketStats from '@/components/MarketStats';

export default function TransactionsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <div className="p-4">Chargement...</div>;
  }

  if (!user) {
    return null; // Ne rien afficher pendant la redirection
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des PSP Coins</h1>
        <Link href="/dashboard" className="text-blue-500 hover:underline">
          Retour au tableau de bord
        </Link>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Votre solde</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-lg font-bold">{user.zth} ZTH</p>
            <p className="text-sm text-gray-600">Votre monnaie principale</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-lg font-bold">{user.pspCoins} PSP Coins</p>
            <p className="text-sm text-gray-600">Votre monnaie d'échange</p>
          </div>
        </div>
      </div>
      
      {/* Ajout du component MarketStats */}
      <MarketStats className="mb-6" />
      
      {/* Voici le composant qui contient les boutons pour acheter et vendre des PSP coins */}
      <CoinTrader />
    </div>
  );
}
