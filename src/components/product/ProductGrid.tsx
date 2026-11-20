import type { Product } from "@/types";
import { cn } from "@/utils";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
   products: Product[];
   className?: string;
}

/**
 * Сетка карточек. Избранное сюда не передаётся: каждое сердечко само берёт его из ViewerProvider,
 * поэтому сетка рисуется сразу и не ждёт запроса к базе.
 */
export function ProductGrid({ products, className }: ProductGridProps) {
   return (
      <ul className={cn("grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4", className)}>
         {products.map((product, index) => (
            <li key={product.id}>
               <ProductCard product={product} priority={index < 4} />
            </li>
         ))}
      </ul>
   );
}
