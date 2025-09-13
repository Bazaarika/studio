import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/hooks/use-auth';
import { CartProvider } from '@/hooks/use-cart';
import { WishlistProvider } from '@/hooks/use-wishlist';
import { RecentlyViewedProvider } from '@/hooks/use-recently-viewed';
import type { Metadata } from 'next';
import { ClientLayout } from '@/components/client-layout';
import { ThemeProvider } from '@/hooks/use-theme';
import { ConnectivityProvider } from '@/hooks/use-connectivity';
import { ServiceWorkerRegistrar } from '@/components/service-worker-registrar';
import { PushNotificationManager } from '@/components/push-notification-manager';
import { Playfair_Display, PT_Sans } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Header } from '@/components/header';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Font setup for performance
const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

const ptSans = PT_Sans({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700'],
  variable: '--font-pt-sans',
});

// Metadata for SEO
export const metadata: Metadata = {
  title: 'Bazaarika - Modern E-commerce',
  description: 'Discover the latest trends in fashion and accessories. Your modern e-commerce experience starts here.',
  manifest: '/manifest.json',
  themeColor: '#A020F0',
  icons: {
    apple: '/icon-192x192.png',
  },
};

function RootLoading() {
  return (
    <div className="flex justify-center items-center h-[calc(100vh-80px)]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </head>
      <body className={cn("antialiased font-body", playfair.variable, ptSans.variable)}>
        <ServiceWorkerRegistrar />
        <PushNotificationManager />
        <ConnectivityProvider>
          <ThemeProvider>
            <AuthProvider>
              <CartProvider>
                <WishlistProvider>
                  <RecentlyViewedProvider>
                    <Header />
                    {/* Wrap children in Suspense for route-level loading */}
                    <Suspense fallback={<RootLoading />}>
                      <ClientLayout>
                          {children}
                      </ClientLayout>
                    </Suspense>
                    <Toaster />
                  </RecentlyViewedProvider>
                </WishlistProvider>
              </CartProvider>
            </AuthProvider>
          </ThemeProvider>
        </ConnectivityProvider>
      </body>
    </html>
  );
}
