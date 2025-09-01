
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

// Font setup
const playfair = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-playfair',
});

const ptSans = PT_Sans({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700'],
  variable: '--font-pt-sans',
});


export const metadata: Metadata = {
  title: 'Bazaarika Lite - Modern E-commerce',
  description: 'Discover the latest trends in fashion and accessories. Your modern e-commerce experience starts here.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        
        {/* PWA Tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Bazaarika" />
        <link rel="apple-touch-icon" href="/icon-192x192.svg" />
        <link rel="icon" href="/icon-192x192.svg" type="image/svg+xml" />
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
                    <div className="hidden md:block">
                      <Header />
                    </div>
                    <ClientLayout>
                        {children}
                    </ClientLayout>
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
