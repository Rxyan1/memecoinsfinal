import './globals.css';
import { AuthProvider } from '../context/AuthContext';

export const metadata = {
  title: 'PSP Coin Platform',
  description: 'Plateforme d\'échange de memecoin PSP',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="dark">
      <body className="bg-gray-900 text-white">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
