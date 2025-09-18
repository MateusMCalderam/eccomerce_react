import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProductById } from '../services/products.js'
import { isAuthenticated } from '../services/auth.js'
import { useCart } from '../services/cartContext.jsx'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const p = await getProductById(id)
        setProduct(p)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <div className="container" style={{ padding: '40px 0' }}>Carregando...</div>
  if (!product) return null

  return (
    <div className="container" style={{ padding: '24px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <div style={{ display: 'grid', placeItems: 'center', border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
        <img src={product.image} alt={product.title} style={{ maxHeight: 360, objectFit: 'contain' }} />
      </div>
      <div>
        <h1 style={{ marginTop: 0 }}>{product.title}</h1>
        <p style={{ color: '#444' }}>{product.description}</p>
        <p style={{ fontSize: 24, fontWeight: 700 }}>${product.price}</p>
        <button
          onClick={() => {
            if (!isAuthenticated()) {
              alert('Faça login para adicionar ao carrinho')
              return
            }
            addItem(product, 1)
            alert('Produto adicionado ao carrinho')
          }}
          style={{ padding: '10px 12px', borderRadius: 6, border: '1px solid #111', background: '#111', color: '#fff' }}
        >
          Adicionar ao carrinho
        </button>
      </div>
    </div>
  )
}


