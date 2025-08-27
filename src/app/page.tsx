
import { getProducts, getFestiveSaleSettings } from '@/lib/firebase/firestore';
import { ProductCardSkeleton } from '@/components/product-card-skeleton';
import { HomeClient } from '@/components/home-client';
import type { Product } from '@/lib/mock-data';
import { generateFestiveSale, type GenerateFestiveSaleOutput } from '@/ai/flows/generate-festive-sale';

// Helper to shuffle an array for random product selection
const shuffleArray = <T,>(array: T[]): T[] => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};


export default async function Home() {
  const allProducts = await getProducts();
  
  let festiveSaleData: GenerateFestiveSaleOutput | null = null;
  
  try {
    const settings = await getFestiveSaleSettings();
    if (settings?.aiMode) {
        festiveSaleData = await generateFestiveSale();
    } else if (settings) {
        festiveSaleData = {
            festivalName: 'Special Sale',
            saleTitle: settings.manualTitle,
            saleDescription: settings.manualDescription,
            suggestedProductKeywords: settings.manualKeywords.split(',').map(k => k.trim()),
        };
    }
  } catch (error) {
      console.error("Failed to get festive sale data:", error);
      // Silently fail, the section won't be rendered
  }

  if (!allProducts || allProducts.length === 0) {
     return (
        <div className="space-y-12">
            <div className="h-64 bg-muted rounded-lg animate-pulse"></div>
            <div className="space-y-4">
                 <div className="h-8 w-1/3 bg-muted rounded animate-pulse"></div>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                </div>
            </div>
        </div>
    )
  }

  // Suggest some products on the server to avoid layout shifts on the client
  const suggestedProducts = shuffleArray([...allProducts]).slice(0, 4);

  return <HomeClient allProducts={allProducts} suggestedProducts={suggestedProducts} initialFestiveSale={festiveSaleData} />;
}
