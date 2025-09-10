
"use client";

import { ProductForm } from "@/app/admin/_components/product-form";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function VendorAddProductPage() {
    const { user, role, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!user || role !== 'vendor')) {
            router.push('/login');
        }
    }, [user, role, loading, router]);

    if (loading || !user || role !== 'vendor') {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return <ProductForm mode="add" userRole="vendor" />;
}
