import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import Navbar from '@/components/ui/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Train Reservation System',
  description: 'Book your train seats easily',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* <Navbar /> */}
      <body className={inter.className}>

        <main className="min-h-screen bg-gray-50">
          <Navbar />
          {children}
          <Toaster />
        </main>
      </body>
    </html>
  );
}