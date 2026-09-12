import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/context/AppContext';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import PageTransitionProgressBar from '@/components/PageTransitionProgressBar';

export const metadata: Metadata = {
  title: 'AuraFlex AI - 40+ Interactive Stories & Roleplay Sagas',
  description: 'Live inside 40+ interactive Pakistani dramas, anime, and underworld stories with delightful AI characters in Hinglish, Urdu, and English.',
};

export const viewport = {
  themeColor: '#050608',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#050608] text-slate-100 min-h-screen flex flex-col antialiased selection:bg-[#FF2E55] selection:text-white">
        <AppProvider>
          {/* Dual Web & Mobile Layout Container */}
          <div className="w-full min-h-screen flex flex-col bg-[#050608] relative">
            <PageTransitionProgressBar />
            <Header />
            <main className="flex-1 w-full flex flex-col">
              {children}
            </main>
            <BottomNav />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
