'use client'

import { ShoppingBag, Menu, X, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/lib/cart-context'
import type { Category } from '@/lib/store-data'
import { categoryLabels } from '@/lib/store-data'
import { useState } from 'react'

interface HeaderProps {
  activeCategory: Category | 'all'
  onCategoryChange: (category: Category | 'all') => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function Header({ 
  activeCategory, 
  onCategoryChange, 
  searchQuery, 
  onSearchChange 
}: HeaderProps) {
  const { totalItems, setIsCartOpen } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  
  const categories: (Category | 'all')[] = ['all', 'parfums', 'soins']

  return (
    <header className="sticky top-0 z-40 bg-background shadow-sm">
      {/* Main Header Row */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Burger Menu */}
        <Button
          variant="ghost"
          size="icon"
          className="text-foreground"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </Button>

        {/* Center: Logo */}
        <h1 className="font-serif text-lg font-bold tracking-tight text-primary sm:text-xl md:text-2xl text-center">
          Perfumes loves by Stephy
        </h1>

        {/* Right: Cart */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-foreground"
          onClick={() => setIsCartOpen(true)}
        >
          <ShoppingBag className="size-6" />
          {totalItems > 0 && (
            <Badge className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-secondary p-0 text-xs font-bold text-secondary-foreground">
              {totalItems}
            </Badge>
          )}
        </Button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="border-t bg-background px-4 py-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-10 w-full rounded-full border border-input bg-background pl-10 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      )}

      {/* Category Pills - Horizontally Scrollable */}
      <div className="border-t">
        <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-accent to-primary text-accent-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
