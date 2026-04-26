'use client'

import { Minus, Plus, Trash2, ShoppingBag, MessageCircle } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/lib/cart-context'
import Image from 'next/image'

const WHATSAPP_NUMBER = '33659012335' // Replace with your actual number

export function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeItem, clearCart, totalItems } = useCart()

  const generateWhatsAppLink = () => {
    if (items.length === 0) return '#'

    const orderLines = items
      .map((item) => `- ${item.quantity}x ${item.product.name}`)
      .join('\n')

    const message = `Bonjour Stephy ! ✨ Voici ma commande :\n\n${orderLines}\n\nTotal : ${totalItems} article(s)\n\nMerci de me confirmer le prix total.`

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
  }

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="flex flex-col p-0 sm:max-w-md">
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle className="flex items-center gap-2 font-serif text-xl text-primary">
            <ShoppingBag className="size-5" />
            Votre panier
          </SheetTitle>
          <SheetDescription>
            {items.length === 0
              ? 'Votre panier est vide'
              : `${totalItems} article(s) dans votre panier`}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 rounded-full bg-secondary p-4">
              <ShoppingBag className="size-8 text-secondary-foreground" />
            </div>
            <p className="mb-2 font-serif text-lg font-medium text-foreground">
              Panier vide
            </p>
            <p className="text-sm text-muted-foreground">
              Découvrez notre collection
            </p>
            <Button
              variant="outline"
              className="mt-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={() => setIsCartOpen(false)}
            >
              Continuer mes achats
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6 py-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-3 rounded-lg bg-muted/50 p-3"
                  >
                    {/* Product Image */}
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-1 flex-col gap-2">
                      <h4 className="text-sm font-medium leading-tight line-clamp-2">
                        {item.product.name}
                      </h4>

                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1 rounded-full border border-border bg-background">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 rounded-full"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                          >
                            <Minus className="size-3" />
                          </Button>
                          <span className="min-w-[1.5rem] text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 rounded-full"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                          >
                            <Plus className="size-3" />
                          </Button>
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.product.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <SheetFooter className="flex-col gap-3 border-t px-6 py-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total articles</span>
                <span className="font-bold text-accent">{totalItems}</span>
              </div>

              <Separator />

              <Button asChild className="w-full gap-2 bg-gradient-to-r from-accent to-primary text-accent-foreground hover:from-accent/90 hover:to-primary/90" size="lg">
                <a
                  href={generateWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="size-5" />
                  Commander sur WhatsApp
                </a>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive"
                onClick={clearCart}
              >
                Vider le panier
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
