'use client'

import { Plus } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import type { Product } from '@/lib/store-data'
import { useState } from 'react'
import Image from 'next/image'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, items } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  
  const cartItem = items.find((item) => item.product.id === product.id)

  const handleAddToCart = () => {
    setIsAdding(true)
    addItem(product)
    setTimeout(() => setIsAdding(false), 300)
  }

  // CORRECTION : On utilise image_url (nom de ta BDD) ou une image par défaut si vide
  // @ts-ignore - Pour ignorer l'erreur de type si image_url n'est pas encore dans Product
  const imageUrl = product.image_url || product.image || "/placeholder.svg"

  return (
    <div 
      className={`relative flex flex-col overflow-hidden rounded-lg bg-card transition-shadow duration-200 ${
        isPressed ? 'shadow-md' : 'shadow-none'
      }`}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
    >
      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
          unoptimized
        />
        
        {/* Cart quantity badge */}
        {cartItem && (
          <div className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
            {cartItem.quantity}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col p-3">
        <h3 className="mb-1 line-clamp-2 min-h-[2.5rem] text-xs font-medium leading-tight text-foreground sm:text-sm">
          {product.name}
        </h3>

        {/* Price */}
        <p className="mb-2 text-sm font-semibold text-primary">
          {product.price ? Number(product.price).toLocaleString('fr-FR') : '0'} FCFA
        </p>

        {/* Add Button */}
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`mt-auto flex w-full items-center justify-center gap-1 rounded-full bg-gradient-to-r from-secondary to-secondary/80 px-3 py-2 text-xs font-medium text-secondary-foreground transition-all hover:from-accent hover:to-primary hover:text-accent-foreground active:scale-95 ${
            isAdding ? 'opacity-70' : ''
          }`}
        >
          <Plus className="size-4" />
          <span>{isAdding ? 'Ajouté' : 'Ajouter'}</span>
        </button>
      </div>
    </div>
  )
}