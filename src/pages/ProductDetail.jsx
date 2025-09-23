import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { isAuthenticated } from '../services/auth.js'
import api from '../services/api.js'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const { data } = await api.get(`/products/${id}`)
        if (!mounted) return
        setProduct(data)
      } finally {
        mounted && setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [id])

  if (loading) return <div className="container" style={{ padding: '40px 0' }}>Carregando...</div>
  if (!product) return null

  return (
    <div
      className="container"
      style={{
        padding: '24px 0',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 24
      }}
    >
      <div
        style={{
          display: 'grid',
          placeItems: 'center',
          border: '1px solid #eee',
          borderRadius: 8,
          padding: 16
        }}
      >
        <img
          src={product.image}
          alt={product.title}
          style={{ maxHeight: 360, objectFit: 'contain' }}
        />
      </div>
      <div>
        <h1 style={{ marginTop: 0 }}>{product.title}</h1>
        <p style={{ color: '#444' }}>{product.description}</p>
        <p style={{ fontSize: 24, fontWeight: 700 }}>${product.price}</p>
        <button
          onClick={async () => {
            if (!isAuthenticated()) {
              const stored = localStorage.getItem('cart')
              const cart = stored ? JSON.parse(stored) : []
              const existing = cart.find((it) => it.product.id === product.id)
              if (existing) existing.quantity += 1
              else cart.push({ product, quantity: 1 })
              localStorage.setItem('cart', JSON.stringify(cart))
              window.dispatchEvent(new Event('storage'))
              alert('Produto adicionado ao carrinho (local)')
              return
            }
            try {
              await api.post('/carts', {
                userId: 1,
                date: new Date().toISOString(),
                products: [{ productId: product.id, quantity: 1 }],
              })
              window.dispatchEvent(new Event('storage'))
              alert('Produto adicionado ao carrinho (API)')
            } catch (e) {
              console.error(e)
              alert('Erro ao adicionar ao carrinho')
            }
          }}
          style={{
            padding: '10px 12px',
            borderRadius: 6,
            border: '1px solid #111',
            background: '#111',
            color: '#fff'
          }}
        >
          Adicionar ao carrinho
        </button>
      </div>
    </div>
  )
}
