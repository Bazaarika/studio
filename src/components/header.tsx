
"use client";

import Link from 'next/link';
import { Search, Bell, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { useCart } from '@/hooks/use-cart';
import { useRouter } from 'next/navigation';
import { type FormEvent } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';

export function Header() {
  const { user, loading } = useAuth();
  const { cart } = useCart();
  const router = useRouter();
  const { toast } = useToast();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const getInitials = (name: string | null | undefined) => {
    if (!name || name.trim() === '') return "U";
    return name.trim()[0].toUpperCase();
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get('q') as string;
    if (searchQuery) {
        router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  const UserAvatar = () => {
    if (loading) {
      return <Skeleton className="h-9 w-9 rounded-full" />;
    }
    return (
      <Link href="/profile">
        <Avatar className="h-9 w-9">
            <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'User'} />
            <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
        </Avatar>
      </Link>
    );
  };

  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold font-headline text-primary">
            Bazaarika
          </Link>
          
          <form onSubmit={handleSearch} className="flex-1 max-w-sm mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input name="q" placeholder="Search" className="pl-10 rounded-full bg-secondary focus:bg-background" />
            </div>
          </form>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="relative" onClick={() => toast({ title: 'Feature coming soon!' })}>
                <Bell className="h-6 w-6" />
                <span className="sr-only">Notifications</span>
            </Button>
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/cart">
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                    {totalItems}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </Link>
            </Button>
            <UserAvatar />
          </div>
        </div>

        {/* Mobile Header - now part of ClientLayout/BottomNav */}
      </div>
    </header>
  );
}
