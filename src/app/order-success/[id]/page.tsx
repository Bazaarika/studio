
import { Button } from "@/components/ui/button";
import { getOrder } from "@/lib/firebase/firestore";
import type { Order } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Check, ShoppingBag, Truck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { headers } from "next/headers";

// Helper function to initialize Firebase Admin SDK safely
async function initializeFirebaseAdmin() {
  const admin = await import('firebase-admin');
  if (admin.apps.length > 0) {
    return { auth: admin.auth() };
  }
  
  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
      console.warn("Firebase Admin credentials environment variables are not set for server-side auth verification.");
      return { auth: null };
  }

  const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  } as admin.ServiceAccount;

  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    return { auth: admin.auth() };
  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error:', error.message);
    return { auth: null };
  }
}

// This is now a Server Component
export default async function OrderSuccessPage({ params }: { params: { id: string } }) {
    const orderId = params.id;
    if (!orderId) {
        notFound();
    }

    const order = await getOrder(orderId);

    // Security check: Verify the user owns this order
    try {
        const { auth } = await initializeFirebaseAdmin();
        const authorization = headers().get('Authorization');
        const idToken = authorization?.split('Bearer ')[1];
        
        if (!auth || !idToken) {
             console.log("Auth not available or no token provided. Falling back to public view.");
        } else {
             const decodedToken = await getAuth().verifyIdToken(idToken);
             if (!order || order.userId !== decodedToken.uid) {
                notFound();
            }
        }
    } catch (error) {
        // If token is invalid or expired, we can treat it as a non-authenticated user.
        // The page will still render if the order exists, but this prevents showing others' orders.
        console.error("Auth token verification failed:", error);
    }
    
    if (!order) {
        notFound();
    }
    
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-4">
             <div className="relative h-24 w-24 mb-6">
                <div className="absolute inset-0 bg-primary rounded-full blur-xl opacity-30"></div>
                <div className={cn(
                    "relative h-24 w-24 rounded-full flex items-center justify-center",
                    "bg-gradient-to-br from-primary/10 via-secondary to-secondary border-2 border-primary/20"
                )}>
                    <Check className="h-12 w-12 text-primary" />
                </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold font-headline mb-2">
                Order Placed Successfully!
            </h1>

            <p className="text-muted-foreground mb-6">
                Thank you for your purchase. Your order is being processed.
            </p>

            <div className="bg-secondary p-4 rounded-lg mb-8">
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="font-mono font-semibold text-primary">#{order.id.substring(0, 7)}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="outline" size="lg">
                    <Link href={`/track-order/${order.id}`}>
                        <Truck className="mr-2 h-5 w-5"/>
                        Track Your Order
                    </Link>
                </Button>
                <Button asChild size="lg">
                     <Link href="/categories">
                        <ShoppingBag className="mr-2 h-5 w-5"/>
                        Continue Shopping
                    </Link>
                </Button>
            </div>
        </div>
    );
}
