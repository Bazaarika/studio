
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
import { useEffect, useState, type ReactNode } from 'react';

function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [showHeader, setShowHeader] = useState(false);
  const [showBottomNav, setShowBottomNav] = useState(false);

  useEffect(() => {
    const isImmersivePage = pathname.startsWith('/product/') || pathname === '/checkout' || pathname === '/profile' || pathname === '/categories' || pathname === '/cart' || pathname === '/wishlist';
    setShowHeader(!isImmersivePage);

    const bottomNavHidden = pathname.startsWith('/product/') || pathname.startsWith('/checkout');
    setShowBottomNav(!bottomNavHidden);
  }, [pathname]);

  return (
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
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>{isAdminPage ? "Bazaarika Admin" : "Bazaarika Lite"}</title>
        <meta name="description" content={isAdminPage ? "Admin dashboard" : "A modern e-commerce experience."} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              {isAdminPage ? (
                <>
                  {children}
                </>
              ) : (
                <ClientLayout>{children}</ClientLayout>
              )}
               <Toaster />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
