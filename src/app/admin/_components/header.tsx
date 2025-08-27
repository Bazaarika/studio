
"use client"

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Home, Package, PanelLeft, ShoppingCart, Users2, List, Send, PartyPopper } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
    { href: "/admin", icon: Home, label: "Dashboard" },
    { href: "/admin/products", icon: List, label: "Products" },
    { href: "/admin/add-product", icon: Package, label: "Add Product" },
    { href: "/admin/send-notification", icon: Send, label: "Send Notification" },
    { href: "/admin/festive-sale", icon: PartyPopper, label: "Festive Sale" },
    { href: "#", icon: ShoppingCart, label: "Orders" },
    { href: "#", icon: Users2, label: "Customers" },
];

export function Header() {
    const pathname = usePathname();

    return (
         <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <Sheet>
                <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="sm:hidden">
                    <PanelLeft className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
                </SheetTrigger>
                <SheetContent side="left" className="sm:max-w-xs">
                    <SheetHeader>
                        <SheetTitle>Menu</SheetTitle>
                    </SheetHeader>
                    <nav className="grid gap-6 text-lg font-medium mt-4">
                        <Link
                            href="#"
                            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                        >
                        B
                            <span className="sr-only">Bazaarika Admin</span>
                        </Link>
                        {navLinks.map(link => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-4 px-2.5",
                                    pathname === link.href ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <link.icon className="h-5 w-5" />
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>
             <div className="hidden sm:block">
                <h1 className="text-xl font-semibold">
                    {navLinks.find(link => link.href === pathname)?.label || "Dashboard"}
                </h1>
            </div>
        </header>
    )
}
