import { useEffect } from 'react'
import { useCart } from '../services/cartContext.jsx'

export default function Cart() {
  const { items, loading, setQuantity, removeItem, clearCart, subtotal, fetchCart } = useCart()

  useEffect(() => {
    fetchCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const inc = (productId) => {
    const item = items.find((i) => i.product.id === productId)
    if (!item) return
    setQuantity(productId, item.quantity + 1)
  }

  const dec = (productId) => {
    const item = items.find((i) => i.product.id === productId)
    if (!item) return
    setQuantity(productId, Math.max(1, item.quantity - 1))
  }

  const removeLine = (productId) => removeItem(productId)
  const clearAll = () => clearCart()

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
              <button onClick={() => fetchCart()} style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #111', background: '#111', color: '#fff' }}>Atualizar</button>
              <button onClick={clearAll} style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #ccc', background: '#fff', color: '#111' }}>Limpar carrinho</button>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}


