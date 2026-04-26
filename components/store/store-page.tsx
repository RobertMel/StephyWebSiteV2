'use client'

import { useState, useMemo, useEffect } from 'react'
import { Header } from './header'
import { ProductGrid } from './product-grid'
import { CartDrawer } from './cart-drawer'
import { type Category, type Product, shuffleArray } from '@/lib/store-data'
import { createClient } from '@/lib/supabase/client'

export function StorePage() {
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Récupération des produits depuis Supabase
  useEffect(() => {
    async function fetchProducts() {
      try {
        const supabase = createClient()
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('id', { ascending: true })

        if (error) {
          console.error('DÉTAILS ERREUR SUPABASE :', error.message)
          setIsLoading(false)
          return
        }

        if (data) {
          console.log('Produits chargés avec succès :', data.length)
          setProducts(shuffleArray([...data]))
        }
      } catch (err) {
        console.error('Erreur inattendue :', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // On convertit en minuscule pour comparer sans erreur
      const cat = (product.category || '').toLowerCase()
      const active = activeCategory.toLowerCase()

      const matchesCategory =
        active === 'all' || cat === active || (active === 'cosmetiques' && cat === 'cosmétiques')
      
      const matchesSearch = (product.name || '')
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
      
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery, products])

  // Compteurs pour le footer (Correction du bug de type avec "as any")
  const parfumsCount = products.filter((p) => (p.category as any) === 'parfums').length
  const soinsCount = products.filter((p) => (p.category as any) === 'soins').length
  const cosmetiquesCount = products.filter((p) => 
    (p.category as any) === 'cosmetiques' || (p.category as any) === 'Cosmétiques'
  ).length

  return (
    <div className="min-h-screen bg-background">
      <Header
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="px-4 py-4">
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {isLoading 
              ? 'Chargement du catalogue...'
              : searchQuery
                ? `Résultats pour "${searchQuery}" (${filteredProducts.length})`
                : `${filteredProducts.length} produit(s) disponible(s)`}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square w-full rounded-lg bg-muted" />
                <div className="mt-2 h-4 w-3/4 rounded bg-muted" />
                <div className="mt-1 h-8 w-full rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} searchQuery={searchQuery} />
        ) : (
          <div className="py-10 text-center">
            <p className="text-muted-foreground">Aucun produit trouvé dans cette catégorie.</p>
            <button 
              onClick={() => setActiveCategory('all')}
              className="mt-2 text-sm text-primary underline"
            >
              Voir tout le catalogue
            </button>
          </div>
        )}
      </main>

      <footer className="mt-8 border-t bg-muted/30 px-4 py-6 text-center">
        <h3 className="mb-1 font-serif text-lg font-semibold text-[#6C244C]">
          Perfumes loves by Stephy
        </h3>
        <p className="text-xs text-muted-foreground">
          {parfumsCount} parfums - {soinsCount} soins - {cosmetiquesCount} cosmétiques
        </p>
        <p className="mt-2 text-xs text-muted-foreground italic">
          Élégance & Pureté
        </p>
      </footer>

      <CartDrawer />
    </div>
  )
}