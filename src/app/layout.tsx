
'use client';

import './globals.css';
import { Header } from '@/components/header';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/hooks/use-auth';
import { CartProvider } from '@/hooks/use-cart';
import { BottomNav } from '@/components/bottom-nav';
import { Footer } from '@/components/footer';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isProductPage = pathname.startsWith('/product/');
  const showHeader = !isProductPage && pathname !== '/categories';
  
  // This logic ensures BottomNav is not rendered at all on the product page
  const showBottomNav = !isProductPage;

  if (!isMounted) {
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
            <div className="flex flex-col min-h-screen">
                <main className="flex-grow pb-20">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        {children}
                    </div>
                </main>
            </div>
        </body>
      </html>
    );
  }

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
            <div className="flex flex-col min-h-screen">
              {showHeader && <Header />}
              <main className="flex-grow pb-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                  {children}
                </div>
              </main>
              <div className="hidden md:block">
                 <Footer />
              </div>
              {showBottomNav && <BottomNav />}
            </div>
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
