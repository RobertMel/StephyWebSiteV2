export type Category = 'parfums' | 'soins' | 'cosmetiques'

export interface Product {
  id: string
  name: string
  category: Category
  price: number | null
  image: string
  created_at?: string
  updated_at?: string
}

export const categoryLabels: Record<Category | 'all', string> = {
  all: 'Tous',
  parfums: 'Parfums',
  soins: 'Soins',
  cosmetiques: 'Cosmétiques',
}

// Shuffle function using Fisher-Yates algorithm
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Empty array as fallback - products are now fetched from Supabase
export const products: Product[] = []
