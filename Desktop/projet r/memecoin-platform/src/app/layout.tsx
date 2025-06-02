import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';
import { AuthProvider } from '../context/AuthContext'; // Adjust the import path as needed

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PSP Coin Platform',
  description: 'A platform for PSP Coin cryptocurrency',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <ToastContainer position="bottom-right" autoClose={5000} />
      </body>
    </html>
  );
}
