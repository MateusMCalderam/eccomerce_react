import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getCart, addItemToCart, updateItemQuantity, removeItemFromCart, clearCartApi } from './cart.js'
import { getProductById } from './products.js'
import { isAuthenticated } from './auth.js'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchCart() {
    setLoading(true)
    try {
      if (!isAuthenticated()) {
        setItems([])
        return
      }
      const data = await getCart()
      const rawItems = (data && data.items) || []
      const normalized = await Promise.all(
        rawItems.map(async (it) => {
          if (it.product) return { product: it.product, quantity: it.quantity }
          if (it.productId) {
            const product = await getProductById(it.productId)
            return { product, quantity: it.quantity }
          }
          return null
        })
      )
      setItems(normalized.filter(Boolean))
    } catch (e) {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function addItem(product, quantity = 1) {
    if (!isAuthenticated()) {
      alert('Faça login para adicionar ao carrinho')
      return
    }
    await addItemToCart(product.id, quantity)
    await fetchCart()
  }

  async function removeItem(productId) {
    if (!isAuthenticated()) {
      alert('Faça login')
      return
    }
    await removeItemFromCart(productId)
    await fetchCart()
  }

  async function setQuantity(productId, quantity) {
    if (!isAuthenticated()) {
      alert('Faça login')
      return
    }
    await updateItemQuantity(productId, quantity)
    await fetchCart()
  }

  async function clearCart() {
    if (!isAuthenticated()) {
      alert('Faça login')
      return
    }
    await clearCartApi()
    setItems([])
  }

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + (i.quantity || 0), 0), [items])
  const subtotal = useMemo(() => items.reduce((sum, i) => sum + (i.product?.price || 0) * (i.quantity || 0), 0), [items])

  const value = { items, loading, addItem, removeItem, setQuantity, clearCart, fetchCart, totalItems, subtotal }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}


