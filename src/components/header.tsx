
'use client';

import Link from 'next/link';
import { Search, Bell, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { useCart } from '@/hooks/use-cart';

export function Header() {
  const { user } = useAuth();
  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name[0];
  };

  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold font-headline text-primary">
              Bazaarika
            </Link>
          </div>
          
          <div className="flex flex-1 max-w-sm mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Search" className="pl-10 rounded-full bg-secondary focus:bg-background" />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-6 w-6" />
                 <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">6</span>
                <span className="sr-only">Notifications</span>
            </Button>
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/cart">
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {totalItems}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </Link>
            </Button>
             <Link href="/profile">
                <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'User'} />
                    <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
                </Avatar>
             </Link>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden flex flex-col gap-4 py-4">
            <div className="flex items-center justify-between">
                 <Link href="/" className="text-2xl font-bold font-headline text-primary">
                    Bazaarika
                </Link>
                <div className="flex items-center gap-2">
                     <Button variant="ghost" size="icon" className="relative rounded-full">
                        <Bell className="h-6 w-6" />
                        <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">6</span>
                        <span className="sr-only">Notifications</span>
                    </Button>
                    <Link href="/profile">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'User'} />
                            <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
                        </Avatar>
                    </Link>
                </div>
            </div>
            <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Search" className="pl-12 pr-12 h-12 rounded-full bg-secondary focus:bg-background w-full" />
                 <Button size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-primary hover:bg-primary/90">
                    <Search className="h-5 w-5 text-primary-foreground" />
                </Button>
            </div>
        </div>
      </div>
    </header>
  );
}
