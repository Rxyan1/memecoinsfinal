'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminMarketTools from '@/components/AdminMarketTools';

export default function AdminPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not authenticated or not an admin
    if (!isLoading && (!isAuthenticated || (user && user.role !== 'ADMIN'))) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) {
    return <div className="p-4">Chargement...</div>;
  }

  // Simple check to display admin tools only for admin users
  if (!user || user.role !== 'ADMIN') {
    return null; // Not displaying anything during redirect
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Panneau d'administration</h1>
      
      <AdminMarketTools />
      
      {/* You can add other admin components here */}
    </div>
  );
}
