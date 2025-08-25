
"use client";

import { useEffect, useState, useMemo } from 'react';
import { ProductCard } from '@/components/product-card';
import type { Product } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal, ShoppingCart, Loader2 } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { generateCategories } from '@/ai/flows/generate-categories';
import Link from 'next/link';

interface CategoriesClientProps {
  products: Product[];
}

export function CategoriesClient({ products }: CategoriesClientProps) {
  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [aiCategories, setAiCategories] = useState<string[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(true);

  useEffect(() => {
    async function fetchAiCategories() {
      if (products.length > 0) {
        setIsAiLoading(true);
        try {
          const productDetails = products.map(p => ({ name: p.name, description: p.description }));
          const result = await generateCategories({ products: productDetails });
          // Ensure "All" is always the first category and there are no duplicates
          setAiCategories(['All', ...new Set(result.categories)]);
        } catch (error) {
          console.error("Failed to fetch AI categories:", error);
          setAiCategories(['All']); // Fallback to just "All"
        } finally {
          setIsAiLoading(false);
        }
      } else {
        setAiCategories(['All']);
        setIsAiLoading(false);
      }
    }
    fetchAiCategories();
  }, [products]);

  const filteredProducts = useMemo(() => {
    let categoryFilteredProducts = products;

    // 1. Filter by category
    if (selectedCategory !== 'All') {
      const lowerCaseCategory = selectedCategory.toLowerCase();
      categoryFilteredProducts = products.filter(product => {
        const productText = [
          product.name,
          product.description,
          product.category,
          ...(product.tags || [])
        ].join(' ').toLowerCase();

        return productText.includes(lowerCaseCategory);
      });
    }

    // 2. Filter by search query on the already category-filtered results
    if (searchQuery) {
      const lowerCaseSearch = searchQuery.toLowerCase();
      return categoryFilteredProducts.filter(product =>
        product.name.toLowerCase().includes(lowerCaseSearch) ||
        product.description.toLowerCase().includes(lowerCaseSearch) ||
        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearch)))
      );
    }
    
    return categoryFilteredProducts;
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">
      <header className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search"
              className="pl-10 h-11 rounded-full bg-secondary focus:bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="ghost" size="icon" className="flex-shrink-0">
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative flex-shrink-0" asChild>
            <Link href="/cart">
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {totalItems}
                </span>
                )}
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {isAiLoading ? (
            <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin"/>
                <span className="text-muted-foreground text-sm">Generating categories...</span>
            </div>
          ) : (
            aiCategories.map((filter) => (
              <Button
                key={filter}
                variant={selectedCategory === filter ? "default" : "secondary"}
                className="rounded-full flex-shrink-0"
                onClick={() => setSelectedCategory(filter)}
              >
                {filter}
              </Button>
            ))
          )}
        </div>
      </header>

      <section>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
             <div className="text-center py-20 bg-secondary/50 rounded-lg flex flex-col items-center">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-semibold mb-2 font-headline">No products found</h2>
                <p className="text-muted-foreground">Try adjusting your search or filters.</p>
            </div>
        )}
      </section>
    </div>
  );
}
