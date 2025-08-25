
'use client';

import './globals.css';
import { Header } from '@/components/header';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/hooks/use-auth';
import { CartProvider } from '@/hooks/use-cart';
import { WishlistProvider } from '@/hooks/use-wishlist';
import { BottomNav } from '@/components/bottom-nav';
import { Footer } from '@/components/footer';
import { usePathname } from 'next/navigation';
import { type ReactNode, useEffect, useState } from 'react';
import { RecentlyViewedProvider } from '@/hooks/use-recently-viewed';

function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  
  // This effect runs once on the client to set the isClient flag.
  // This is crucial for preventing hydration errors with components
  // that rely on client-side state, like the BottomNav cart count.
  useEffect(() => {
    setIsClient(true);
  }, []);

  const isAdminPage = pathname.startsWith('/admin');
  
  // Conditionally render based on the page type
  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {children}
        </div>
      </main>
      <div className="hidden md:block">
        <Footer />
      </div>
       {/* Only render BottomNav on the client to avoid hydration errors */}
      {isClient && <BottomNav />}
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Bazaarika Lite</title>
        <meta name="description" content="A modern e-commerce experience." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <RecentlyViewedProvider>
                <ClientLayout>{children}</ClientLayout>
              </RecentlyViewedProvider>
               <Toaster />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
