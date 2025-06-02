import { useState, useEffect } from 'react';
import axios from 'axios';
// Remove or update this import - ToastContainer needs to be added to layout
import { toast } from 'react-toastify';

interface User {
  id: string;
  username: string;
  zth: number;
  pspCoins?: number; // Make pspCoins optional to prevent errors with old data
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users');
      // Ensure we always have an array, even if the API returns something unexpected
      setUsers(Array.isArray(response.data.users) ? response.data.users : []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Erreur lors de la récupération des utilisateurs');
      setError(true);
      // Set an empty array to prevent "length of undefined" errors
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyPSPCoin = async (userId: string) => {
    try {
      setProcessing(userId);
      await axios.post('/api/users/buy-pspcoin', { userId });
      toast.success('PSP Coin acheté avec succès !');
      // Refresh the user list to show updated balances
      fetchUsers();
    } catch (error) {
      console.error('Failed to buy PSP Coin:', error);
      toast.error('Erreur lors de l\'achat du PSP Coin');
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Liste des utilisateurs</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          Une erreur est survenue lors du chargement des utilisateurs.
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2 border">Nom d'utilisateur</th>
              <th className="px-4 py-2 border">ZTH</th>
              <th className="px-4 py-2 border">PSP Coins</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Only map if users exists and has items */}
            {users && users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{user.username}</td>
                  <td className="px-4 py-2 border">{user.zth}</td>
                  <td className="px-4 py-2 border">{user.pspCoins || 0}</td>
                  <td className="px-4 py-2 border">
                    <button 
                      onClick={() => handleBuyPSPCoin(user.id)}
                      disabled={user.zth < 1 || processing === user.id}
                      className={`px-4 py-1 rounded ${
                        user.zth < 1 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {processing === user.id ? 'Traitement...' : 'Acheter PSP Coin (1 ZTH)'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-2 text-center">
                  {loading ? 'Chargement...' : 'Aucun utilisateur trouvé'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}