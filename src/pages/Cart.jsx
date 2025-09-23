import { useEffect, useMemo, useState } from 'react'
import api from '../services/api.js'
import { isAuthenticated } from '../services/auth.js'

function readCart() {
  try {
    const raw = localStorage.getItem('cart')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeCart(items) {
  localStorage.setItem('cart', JSON.stringify(items))
  window.dispatchEvent(new Event('storage'))
}

function setQuantity(productId, quantity) {
  const items = readCart().map((i) => (i.product.id === productId ? { ...i, quantity: Math.max(1, quantity) } : i))
  writeCart(items)
}

function removeItem(productId) {
  const items = readCart().filter((i) => i.product.id !== productId)
  writeCart(items)
}

function clearCart() {
  writeCart([])
}

export default function Cart() {
  const [items, setItems] = useState(() => readCart())
  const [loading, setLoading] = useState(false)

  // when authenticated, load cart from API
  useEffect(() => {
    let mounted = true
    async function loadFromApi() {
      if (!isAuthenticated()) return
      setLoading(true)
      try {
        // Assumption: using demo userId=1; API returns array of carts for user
        const { data: carts } = await api.get('/carts/user/1')
        if (!Array.isArray(carts) || carts.length === 0) return
        const latest = carts[carts.length - 1]
        const proms = (latest.products || []).map(async (p) => {
          const { data: product } = await api.get(`/products/${p.productId}`)
          return { product, quantity: p.quantity }
        })
        const resolved = await Promise.all(proms)
        if (!mounted) return
        setItems(resolved)
      } catch (e) {
        console.error('cart fetch error', e)
      } finally {
        mounted && setLoading(false)
      }
    }
    loadFromApi()
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
  const onStorage = () => setItems(readCart())
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const inc = (productId) => {
    const item = items.find((i) => i.product.id === productId)
    if (!item) return
  const next = items.map((it) => (it.product.id === productId ? { ...it, quantity: it.quantity + 1 } : it))
  setItems(next)
  if (isAuthenticated()) persistCartToApi(next)
  else setQuantity(productId, item.quantity + 1)
  }

  const dec = (productId) => {
    const item = items.find((i) => i.product.id === productId)
    if (!item) return
  const next = items.map((it) => (it.product.id === productId ? { ...it, quantity: Math.max(1, it.quantity - 1) } : it))
  setItems(next)
  if (isAuthenticated()) persistCartToApi(next)
  else setQuantity(productId, Math.max(1, item.quantity - 1))
  }

  const removeLine = (productId) => {
    const next = items.filter((i) => i.product.id !== productId)
    setItems(next)
    if (isAuthenticated()) persistCartToApi(next)
    else removeItem(productId)
  }
  const clearAll = () => {
    setItems([])
    if (isAuthenticated()) persistCartToApi([])
    else clearCart()
  }

  // persist to API by creating a new cart (demo API). This is best-effort.
  async function persistCartToApi(itemsToPersist) {
    try {
      const payload = {
        userId: 1,
        date: new Date().toISOString(),
        products: itemsToPersist.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
      }
      await api.post('/carts', payload)
      // no further action; UI already updated optimistically
    } catch (e) {
      console.error('persist cart error', e)
    }
  }

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + (i.product?.price || 0) * (i.quantity || 0), 0), [items])

  return (
    <div className="container" style={{ padding: '24px 0' }}>
      <h2 style={{ marginTop: 0 }}>Carrinho</h2>
      {loading ? (
        <div>Carregando...</div>
      ) : items.length === 0 ? (
        <div style={{ color: '#666' }}>Seu carrinho está vazio.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          <div style={{ display: 'grid', gap: 12 }}>
            {items.map(({ product, quantity }) => {
              const lineTotal = product.price * quantity
              return (
                <div key={product.id} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 160px 100px', alignItems: 'center', gap: 12, border: '1px solid #eee', borderRadius: 8, padding: 12 }}>
                  <div style={{ display: 'grid', placeItems: 'center', background: '#fafafa', borderRadius: 8, padding: 8 }}>
                    <img src={product.image} alt={product.title} style={{ maxHeight: 64, objectFit: 'contain' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#111' }}>{product.title}</div>
                    <div style={{ color: '#666', fontSize: 12 }}>Qtd: {quantity}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
                    <button onClick={() => dec(product.id)} style={{ padding: '4px 8px', border: '1px solid #ccc', background: '#fff', borderRadius: 6 }}>-</button>
                    <span style={{ minWidth: 24, textAlign: 'center' }}>{quantity}</span>
                    <button onClick={() => inc(product.id)} style={{ padding: '4px 8px', border: '1px solid #ccc', background: '#fff', borderRadius: 6 }}>+</button>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#111' }}>${product.price.toFixed(2)}</div>
                    <div style={{ color: '#444', fontSize: 12 }}>${lineTotal.toFixed(2)} total</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <button onClick={() => removeLine(product.id)} style={{ color: '#b00', background: 'transparent', border: 'none', cursor: 'pointer' }}>Remover</button>
                  </div>
                </div>
              )
            })}
          </div>
          <aside style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, height: 'fit-content', background: '#fafafa' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span>Subtotal</span>
              <strong>
                ${subtotal.toFixed(2)}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666', marginBottom: 12 }}>
              <span>Frete</span>
              <span>Grátis</span>
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              <button onClick={() => setItems(readCart())} style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #111', background: '#111', color: '#fff' }}>Atualizar</button>
              <button onClick={clearAll} style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #ccc', background: '#fff', color: '#111' }}>Limpar carrinho</button>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}


