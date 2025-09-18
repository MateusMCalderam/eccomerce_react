import { useEffect, useState } from 'react'
import { getAllProducts, getCategories, getByCategory } from '../services/products.js'
import ProductGrid from '../components/ProductGrid.jsx'

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [cats, prods] = await Promise.all([getCategories(), getAllProducts()])
        setCategories(cats)
        setProducts(prods)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function filterByCategory(category) {
    setActiveCategory(category)
    setLoading(true)
    const prods = category ? await getByCategory(category) : await getAllProducts()
    setProducts(prods)
    setLoading(false)
  }

  return (
    <div>
      <div className="container" style={{ paddingTop: 24, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button onClick={() => filterByCategory('')} style={{ padding: '8px 12px', borderRadius: 20, border: '1px solid #ddd', background: activeCategory === '' ? '#111' : '#fff', color: activeCategory === '' ? '#fff' : '#111' }}>Todos</button>
        {categories.map((c) => (
          <button key={c} onClick={() => filterByCategory(c)} style={{ padding: '8px 12px', borderRadius: 20, border: '1px solid #ddd', background: activeCategory === c ? '#111' : '#fff', color: activeCategory === c ? '#fff' : '#111', textTransform: 'capitalize' }}>{c}</button>
        ))}
      </div>
      {loading ? (
        <div className="container" style={{ padding: '40px 0' }}>Carregando...</div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  )
}


