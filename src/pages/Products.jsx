import { useEffect, useState } from 'react'
import ProductGrid from '../components/ProductGrid.jsx'
import api from '../services/api.js'
import { isAuthenticated } from '../services/auth.js'

// NOTE: using API endpoints directly. Assumption: API exposes
// /products, /products/categories and /products/category/:category
// and /carts for cart ops. When user is authenticated the cart
// requests will be sent to API; otherwise we fallback to localStorage.

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    Promise.all([
      api.get('/products/categories').then((r) => r.data),
      api.get('/products').then((r) => r.data),
    ])
      .then(([cats, prods]) => {
        if (!mounted) return
        setCategories(cats)
        setProducts(prods)
      })
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [])

  function filterByCategory(category) {
    setActiveCategory(category)
    setLoading(true)
    const fetcher = category
      ? api.get(`/products/category/${encodeURIComponent(category)}`).then((r) => r.data)
      : api.get('/products').then((r) => r.data)
    fetcher
      .then((prods) => setProducts(prods))
      .finally(() => setLoading(false))
  }

  async function handleAddToCart(product) {
    if (!isAuthenticated()) {
      // fallback to localStorage if not authenticated
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
      // create a cart with the product. Assumption: userId 1 used by demo API
      await api.post('/carts', {
        userId: 1,
        date: new Date().toISOString(),
        products: [{ productId: product.id, quantity: 1 }],
      })
      alert('Produto adicionado ao carrinho (API)')
      // trigger storage listeners (other UI may listen)
      window.dispatchEvent(new Event('storage'))
    } catch (e) {
      console.error(e)
      alert('Erro ao adicionar ao carrinho')
    }
  }

  return (
    <div>
      {/* Categorias */}
      <div
        className="container"
        style={{
          paddingTop: 24,
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}
      >
        <button
          onClick={() => filterByCategory('')}
          style={{
            padding: '8px 16px',
            borderRadius: 30,
            border: '1px solid #ddd',
            background: activeCategory === '' ? '#111' : '#fff',
            color: activeCategory === '' ? '#fff' : '#111',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Todos
        </button>

        {categories.map((c) => (
          <button
            key={c}
            onClick={() => filterByCategory(c)}
            style={{
              padding: '8px 16px',
              borderRadius: 30,
              border: '1px solid #ddd',
              background: activeCategory === c ? '#111' : '#fff',
              color: activeCategory === c ? '#fff' : '#111',
              textTransform: 'capitalize',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Produtos */}
      {loading ? (
        <div
          className="container"
          style={{ padding: '60px 0', textAlign: 'center', fontSize: 18 }}
        >
          ⏳ Carregando produtos...
        </div>
      ) : (
        <ProductGrid
          products={products.map((p) => ({
            ...p,
            onAddToCart: () => handleAddToCart(p)
          }))}
        />
      )}
    </div>
  )
}
