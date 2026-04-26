'use client'

import { ProductCard } from './product-card'
import type { Product } from '@/lib/store-data'
import { Package } from 'lucide-react'

interface ProductGridProps {
  products: Product[]
  searchQuery: string
}

export function ProductGrid({ products, searchQuery }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 rounded-full bg-secondary p-4">
          <Package className="size-8 text-secondary-foreground" />
        </div>
        <h3 className="mb-2 font-serif text-lg font-medium text-foreground">
          Aucun produit trouvé
        </h3>
        <p className="text-sm text-muted-foreground">
          {searchQuery 
            ? `Aucun résultat pour "${searchQuery}"`
            : 'Aucun produit dans cette catégorie'}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
