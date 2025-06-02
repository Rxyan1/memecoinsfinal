'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

function Navigation() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-purple-500">PSP</span>
              <span className="ml-1 text-white font-semibold">Coin</span>
            </Link>
            <div className="hidden md:ml-8 md:flex md:space-x-6">
              <Link href="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Accueil
              </Link>
              <Link href="/about" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                À propos
              </Link>
              {user && (
                <Link href="/dashboard" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
              )}
            </div>
          </div>
          <div className="hidden md:flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-300">
                  <span className="mr-1">Solde:</span>
                  <span className="font-medium text-purple-400">{user.pspCoins} PSP</span>
                </div>
                <div className="text-sm font-medium text-gray-300">
                  <span>{user.username}</span>
                </div>
                <button
                  onClick={logout}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login" className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Connexion
                </Link>
                <Link href="/register" className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Inscription
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              <svg
                className={`${mobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${mobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden border-t border-gray-700`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link href="/" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
            Accueil
          </Link>
          <Link href="/about" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
            À propos
          </Link>
          {user && (
            <Link href="/dashboard" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              Dashboard
            </Link>
          )}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-700">
          {user ? (
            <div className="px-4 space-y-3">
              <div className="text-base font-medium text-white">{user.username}</div>
              <div className="text-sm text-gray-300">
                <span className="mr-1">Solde:</span>
                <span className="font-medium text-purple-400">{user.pspCoins} PSP</span>
              </div>
              <button
                onClick={logout}
                className="w-full text-left block text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <div className="px-2 space-y-2">
              <Link href="/login" className="block w-full text-center bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-base font-medium">
                Connexion
              </Link>
              <Link href="/register" className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-md text-base font-medium">
                Inscription
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
