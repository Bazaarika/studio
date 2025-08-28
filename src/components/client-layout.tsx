
'use client';

import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';
import { Footer } from '@/components/footer';
import { BottomNav } from '@/components/bottom-nav';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isAdminPage = pathname.startsWith('/admin');

  if (isAdminPage) {
    return <>{children}</>;
  }

  const isProductPage = pathname.startsWith('/product/');
  const isCheckoutPage = pathname === '/checkout';
  
  const showBottomNav = !isProductPage && !isCheckoutPage;

  return (
    <div className="flex flex-col min-h-screen">
      <main className={cn("flex-grow", showBottomNav && "pb-16 md:pb-0")}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
        </div>
      </main>
      <div className="hidden md:block">
        <Footer />
      </div>
       {showBottomNav && <BottomNav />}
    </div>
  );
}
