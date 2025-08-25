
'use client';

import { usePathname } from 'next/navigation';
import { type ReactNode, useEffect, useState } from 'react';
import { Footer } from '@/components/footer';
import { BottomNav } from '@/components/bottom-nav';

export function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isAdminPage = pathname.startsWith('/admin');

  if (isAdminPage) {
    return <>{children}</>;
  }

  const isProductPage = pathname.startsWith('/product/');
  const isCheckoutPage = pathname === '/checkout';
  
  // Only render BottomNav on the client to avoid hydration errors
  const showBottomNav = isClient && !isProductPage && !isCheckoutPage;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
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
