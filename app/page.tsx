import { CartProvider } from '@/lib/cart-context'
import { StorePage } from '@/components/store/store-page'

export default function Home() {
  return (
    <CartProvider>
      <StorePage />
    </CartProvider>
  )
}
