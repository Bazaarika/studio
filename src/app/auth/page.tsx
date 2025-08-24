
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

// This is a dedicated page to handle the authentication redirect.
// It will check the auth state and redirect the user to the profile page.
export default function AuthPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for the auth state to be confirmed
    if (!loading) {
      if (user) {
        // If user is logged in, redirect to the profile page
        router.push('/profile');
      } else {
        // If user is not logged in, send them back to the login page
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  // Display a loading indicator while we are processing the authentication
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Authenticating, please wait...</p>
      </div>
    </div>
  );
}
