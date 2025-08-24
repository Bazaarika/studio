
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-secondary/50 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold font-headline text-primary mb-4">Bazaarika</h3>
            <p className="text-sm text-muted-foreground">Your modern e-commerce experience.</p>
          </div>
          <div>
            <h4 className="font-headline font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/categories" className="text-muted-foreground hover:text-primary">Clothing</Link></li>
              <li><Link href="/categories" className="text-muted-foreground hover:text-primary">Accessories</Link></li>
              <li><Link href="/categories" className="text-muted-foreground hover:text-primary">Shoes</Link></li>
              <li><Link href="/categories" className="text-muted-foreground hover:text-primary">Jewelry</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline font-semibold mb-4">About</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Careers</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-primary">FAQ</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Shipping & Returns</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Track Order</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Bazaarika. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
