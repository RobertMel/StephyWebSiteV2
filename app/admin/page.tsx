'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Product, Category } from '@/lib/store-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Lock, RefreshCw, Save, Check, AlertCircle, ArrowLeft, Package } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const ADMIN_PASSWORD = 'stephy2024'

const categoryLabels: Record<Category, string> = {
  parfums: 'Parfums',
  soins: 'Soins',
  cosmetiques: 'Cosmétiques',
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [savedId, setSavedId] = useState<string | null>(null)
  const [editedProducts, setEditedProducts] = useState<Record<string, Partial<Product>>>({})

  const fetchProducts = useCallback(async () => {
    setIsLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching products:', error)
    } else {
      setProducts(data || [])
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts()
    }
  }, [isAuthenticated, fetchProducts])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setPasswordError(false)
    } else {
      setPasswordError(true)
    }
  }

  const handleProductChange = (productId: string, field: keyof Product, value: string | number | null) => {
    setEditedProducts((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }))
  }

  const handleSave = async (productId: string) => {
    const changes = editedProducts[productId]
    if (!changes) return

    setSavingId(productId)
    const supabase = createClient()

    const { error } = await supabase
      .from('products')
      .update(changes)
      .eq('id', productId)

    if (error) {
      console.error('Error updating product:', error)
      alert('Erreur lors de la mise à jour')
    } else {
      // Update local state
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, ...changes } : p))
      )
      // Clear edited state for this product
      setEditedProducts((prev) => {
        const newState = { ...prev }
        delete newState[productId]
        return newState
      })
      // Show saved indicator
      setSavedId(productId)
      setTimeout(() => setSavedId(null), 2000)
    }
    setSavingId(null)
  }

  const getProductValue = (product: Product, field: keyof Product) => {
    const edited = editedProducts[product.id]
    if (edited && field in edited) {
      return edited[field]
    }
    return product[field]
  }

  const hasChanges = (productId: string) => {
    return !!editedProducts[productId] && Object.keys(editedProducts[productId]).length > 0
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
              <Lock className="size-6 text-primary" />
            </div>
            <CardTitle className="font-serif text-xl">Administration</CardTitle>
            <p className="text-sm text-muted-foreground">
              Perfumes loves by Stephy
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setPasswordError(false)
                  }}
                  placeholder="Entrez le mot de passe"
                  className={passwordError ? 'border-destructive' : ''}
                />
                {passwordError && (
                  <p className="flex items-center gap-1 text-sm text-destructive">
                    <AlertCircle className="size-4" />
                    Mot de passe incorrect
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full">
                Connexion
              </Button>
              <Button variant="ghost" asChild className="w-full">
                <Link href="/">
                  <ArrowLeft className="mr-2 size-4" />
                  Retour à la boutique
                </Link>
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Package className="size-5 text-primary" />
            <h1 className="font-serif text-lg font-semibold text-foreground">
              Gestion des produits
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchProducts}
              disabled={isLoading}
            >
              <RefreshCw className={`mr-2 size-4 ${isLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 size-4" />
                Boutique
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="border-b bg-muted/30 px-4 py-3">
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="text-muted-foreground">
            Total: <strong className="text-foreground">{products.length}</strong> produits
          </span>
          <span className="text-muted-foreground">
            Parfums: <strong className="text-foreground">{products.filter(p => p.category === 'parfums').length}</strong>
          </span>
          <span className="text-muted-foreground">
            Soins: <strong className="text-foreground">{products.filter(p => p.category === 'soins').length}</strong>
          </span>
          <span className="text-muted-foreground">
            Cosmétiques: <strong className="text-foreground">{products.filter(p => p.category === 'cosmetiques').length}</strong>
          </span>
        </div>
      </div>

      {/* Products List */}
      <main className="p-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <Card key={product.id} className={hasChanges(product.id) ? 'ring-2 ring-primary/50' : ''}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    {/* Edit Form */}
                    <div className="flex flex-1 flex-col gap-3">
                      {/* Name Input */}
                      <div className="space-y-1">
                        <Label htmlFor={`name-${product.id}`} className="text-xs text-muted-foreground">
                          Nom du produit
                        </Label>
                        <Input
                          id={`name-${product.id}`}
                          value={getProductValue(product, 'name') as string}
                          onChange={(e) => handleProductChange(product.id, 'name', e.target.value)}
                          placeholder="Nom du produit"
                          className="h-9"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {/* Price Input */}
                        <div className="space-y-1">
                          <Label htmlFor={`price-${product.id}`} className="text-xs text-muted-foreground">
                            Prix (FCFA)
                          </Label>
                          <Input
                            id={`price-${product.id}`}
                            type="number"
                            value={(getProductValue(product, 'price') as number | null) ?? ''}
                            onChange={(e) => {
                              const value = e.target.value === '' ? null : parseFloat(e.target.value)
                              handleProductChange(product.id, 'price', value)
                            }}
                            placeholder="Prix"
                            className="h-9"
                          />
                        </div>

                        {/* Category Select */}
                        <div className="space-y-1">
                          <Label htmlFor={`category-${product.id}`} className="text-xs text-muted-foreground">
                            Catégorie
                          </Label>
                          <Select
                            value={getProductValue(product, 'category') as Category}
                            onValueChange={(value) => handleProductChange(product.id, 'category', value)}
                          >
                            <SelectTrigger id={`category-${product.id}`} className="h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="parfums">Parfums</SelectItem>
                              <SelectItem value="soins">Soins</SelectItem>
                              <SelectItem value="cosmetiques">Cosmétiques</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Save Button */}
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          onClick={() => handleSave(product.id)}
                          disabled={!hasChanges(product.id) || savingId === product.id}
                          className="gap-2"
                        >
                          {savingId === product.id ? (
                            <>
                              <RefreshCw className="size-4 animate-spin" />
                              Sauvegarde...
                            </>
                          ) : savedId === product.id ? (
                            <>
                              <Check className="size-4" />
                              Sauvegardé
                            </>
                          ) : (
                            <>
                              <Save className="size-4" />
                              Sauvegarder
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
