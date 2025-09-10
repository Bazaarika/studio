
"use client"

import Link from "next/link";
import { Home, Package, ShoppingCart, Users2, Settings, List, Send, LayoutTemplate, FileText, Undo2, ImageIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
    { href: "/admin", icon: Home, label: "Dashboard" },
    { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
    { href: "/admin/products", icon: List, label: "Products" },
    { href: "/admin/add-product", icon: Package, label: "Add Product" },
    { href: "/admin/returns", icon: Undo2, label: "Manage Returns" },
    { href: "/admin/customers", icon: Users2, label: "Customers" },
    { href: "/admin/customize-home", icon: LayoutTemplate, label: "Customize Home" },
    { href: "/admin/pages", icon: FileText, label: "Pages" },
    { href: "/admin/image-prompter", icon: ImageIcon, label: "AI Image Prompter" },
    { href: "/admin/send-notification", icon: Send, label: "Send Notification" },
];


export function SidebarNav() {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === '/admin') {
            return pathname === '/admin';
        }
        return pathname.startsWith(href);
    };

    return (
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
            <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                <Link
                href="#"
                className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                >
                    B
                    <span className="sr-only">Bazaarika Admin</span>
                </Link>
                <TooltipProvider>
                    {navLinks.map(link => (
                         <Tooltip key={link.label}>
                            <TooltipTrigger asChild>
                                <Link
                                    href={link.href}
                                    className={cn(
                                        "flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8",
                                        isActive(link.href) ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <link.icon className="h-5 w-5" />
                                    <span className="sr-only">{link.label}</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">{link.label}</TooltipContent>
                        </Tooltip>
                    ))}
                </TooltipProvider>
            </nav>
             <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                        <Link
                            href="#"
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                        >
                            <Settings className="h-5 w-5" />
                            <span className="sr-only">Settings</span>
                        </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Settings</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </nav>
      </aside>
    )
}
