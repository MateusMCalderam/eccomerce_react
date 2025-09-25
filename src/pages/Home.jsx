import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import api from '../services/api.js'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState('Todos')

  const location = useLocation()
  useEffect(() => {
    const qp = new URLSearchParams(location.search)
    const cat = qp.get('cat')
    if (cat) setActiveCategory(cat)
  }, [location.search])

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const { data } = await api.get('/products')
        if (!mounted) return
        setProducts(Array.isArray(data) ? data : [])
      } catch (err) {
        if (!mounted) return
        setError('Não foi possível carregar os produtos.')
        console.error(err)
      } finally {
        mounted && setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const categories = React.useMemo(() => {
    const setCats = new Set()
    products.forEach(p => {
      const cat =
        (p.category && (typeof p.category === 'string' ? p.category : p.category.name)) ||
        p.department ||
        p.type ||
        'Sem categoria'
      setCats.add(cat)
    })
    return ['Todos', ...Array.from(setCats)]
  }, [products])

  const filtered = React.useMemo(() => {
    if (!activeCategory || activeCategory === 'Todos') return products
    return products.filter(p => {
      const cat =
        (p.category && (typeof p.category === 'string' ? p.category : p.category.name)) ||
        p.department ||
        p.type ||
        'Sem categoria'
      return cat === activeCategory
    })
  }, [products, activeCategory])



  return (
    <div className="landing">
      
      <main className="container" style={{ paddingBottom: 24 }}>
        <section className="hero" aria-labelledby="hero-title">
          <div>
            <div style={{ display: 'inline-block', padding: '6px 10px', borderRadius: 999, background: 'var(--white)', border: '1px solid var(--g2)', fontWeight: 800, fontSize: 13, marginBottom: 12 }}>Oferta do dia</div>
            <h1 id="hero-title">Peças práticas e elegantes para o dia a dia</h1>
            <p className="sub">Minimal Store — Peças atemporais, entrega rápida e atendimento dedicado. Compre com segurança.</p>

            <div className="hero-cta">
              <Link to="/produtos" className="btn-primary">Comprar agora</Link>
              <Link to="/produtos?filter=new" className="btn-ghost">Novidades</Link>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div className="blob a" />
            <div className="blob b" />

            <div className="product-card" aria-hidden>
              <div className="product-visual">
                {products[0] && products[0].image ? (
                  <img src={products[0].image} alt={products[0].title} />
                ) : (
                  <div style={{ width: 120, height: 120, borderRadius: 12, background: 'var(--g2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--g5)', fontWeight: 800 }}>IMG</div>
                )}
              </div>

              <div className="product-info">
                <div className="tag">Seleção</div>
                <h3 style={{ margin: 0 }} className="product-name">{products[0]?.title ?? 'Produto destaque'}</h3>
                <p className="product-desc">{products[0]?.description ? products[0].description.slice(0, 80) + '...' : 'Descrição curta do produto.'}</p>
                <div className="price-row" style={{ display: 'flex', alignItems: 'center' }}>
                  <div className="price">{products[0] ? `$${products[0].price}` : '$0.00'}</div>
                  <Link to={products[0] ? `/produtos/${products[0].id}` : '/produtos'} className="btn-ctasm" style={{ marginLeft: 'auto', background: 'var(--black)', color: 'var(--white)', textDecoration: 'none' }}>Ver produto</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="cats-title" style={{ paddingTop: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 id="cats-title" style={{ margin: 0 }}>Categorias</h3>
            <Link to="/produtos" style={{ color: 'var(--g5)', textDecoration: 'none', fontWeight: 700 }}>Ver tudo</Link>
          </div>

          <div className="cats" role="tablist" aria-label="Categorias disponíveis" style={{ marginTop: 12 }}>
            {categories.map(cat => (
              <button
                key={cat}
                className={`cat-btn ${cat === activeCategory ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
                aria-pressed={cat === activeCategory}
                type="button"
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="center">Carregando produtos...</div>
          ) : error ? (
            <div className="center">{error}</div>
          ) : (
            <>
              <div className="grid">
                {filtered.slice(0, 3).map(p => (
                  <article key={p.id} className="card" aria-labelledby={`prod-${p.id}`}>
                    <Link to={`/produtos/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div className="img-wrap" role="img" aria-label={p.title}>
                        {p.image ? (
                          <img src={p.image} alt={p.title} />
                        ) : (
                          <div style={{ width: 110, height: 110, borderRadius: 12, background: 'var(--g2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--g5)', fontWeight: 800 }}>
                            IMG
                          </div>
                        )}
                      </div>

                      <div style={{ paddingTop: 6 }}>
                        <div id={`prod-${p.id}`} className="title">{p.title}</div>
                        <div className="meta" style={{ marginTop: 6 }}>
                          {(p.category && (typeof p.category === 'string' ? p.category : p.category.name)) || p.department || '—'}
                        </div>
                      </div>
                    </Link>

                    <div className="card-footer">
                      <div className="price-small">${p.price}</div>
                      <Link to={`/produtos/${p.id}`} className="btn-add" style={{ textDecoration: 'none', display: 'inline-block', textAlign: 'center' }}>Ver</Link>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  )
}
