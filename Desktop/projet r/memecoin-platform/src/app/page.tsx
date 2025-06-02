'use client';

import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import CoinTrader from '../components/CoinTrader';
import MarketStats from '@/components/MarketStats';

export default function Home() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [showDemo, setShowDemo] = useState(false);

  // Si l'utilisateur est connecté, on lui montre son dashboard
  // Sinon, on lui montre une page d'accueil avec des informations sur la plateforme
  return (
    <div className="min-h-screen bg-gray-100">
      {isLoading ? (
        <div className="p-8 text-center">
          <p className="text-xl">Chargement...</p>
        </div>
      ) : isAuthenticated && user ? (
        // Dashboard pour utilisateurs connectés
        <div className="p-4 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Section informations utilisateur */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Votre compte</h2>
                <div className="space-y-2">
                  <p><span className="font-medium">Utilisateur:</span> {user.username}</p>
                  <p><span className="font-medium">Email:</span> {user.email}</p>
                </div>
              </div>

              {/* Section solde */}
              <div className="bg-white rounded-lg shadow-md p-6 mt-4">
                <h2 className="text-xl font-bold mb-4">Votre solde</h2>
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

                {/* Utiliser le nouveau composant MarketStats */}
                <MarketStats />
                
                {/* Bouton de déconnexion ajouté */}
                <div className="mt-6">
                  <button 
                    onClick={logout}
                    className="w-full bg-red-500 text-white px-4 py-2 rounded-md text-center hover:bg-red-600 transition"
                  >
                    Se déconnecter
                  </button>
                </div>
              </div>
            </div>

            {/* Sections principales */}
            <div className="lg:col-span-2">
              {/* Composant d'achat/vente de PSP coins */}
              <CoinTrader />
            </div>
          </div>
        </div>
      ) : (
        // Landing page pour visiteurs non connectés
        <div>
          {/* Suppression de la section d'en-tête avec le titre et les boutons */}
          
          {showDemo && (
            <div className="py-12 bg-gray-50">
              <div className="max-w-4xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8">Comment ça fonctionne</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="text-2xl font-bold text-blue-600 mb-4">1</div>
                    <h3 className="text-xl font-semibold mb-2">Inscrivez-vous</h3>
                    <p className="text-gray-600">Créez un compte pour recevoir 100 ZTH gratuits pour démarrer.</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="text-2xl font-bold text-blue-600 mb-4">2</div>
                    <h3 className="text-xl font-semibold mb-2">Échangez des PSP Coins</h3>
                    <p className="text-gray-600">Convertissez vos ZTH en PSP Coins pour participer au marché.</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="text-2xl font-bold text-blue-600 mb-4">3</div>
                    <h3 className="text-xl font-semibold mb-2">Créez & Échangez</h3>
                    <p className="text-gray-600">Créez vos propres memecoins ou achetez ceux des autres utilisateurs.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="py-16 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-8">Rejoignez notre communauté</h2>
              <div className="flex justify-center space-x-4">
                <Link href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-md font-bold hover:bg-blue-700 transition">
                  Se connecter
                </Link>
                <Link href="/signup" className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md font-bold hover:bg-gray-300 transition">
                  S'inscrire
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
