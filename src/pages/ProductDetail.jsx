import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { isAuthenticated } from '../services/auth.js'
import api from '../services/api.js'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [qty, setQty] = useState(1)
  const [related, setRelated] = useState([])

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      setError(null)
      setRelated([])
      try {
        const { data } = await api.get(`/products/${id}`)
        if (!mounted) return
        setProduct(data)
        setSelectedImageIndex(0)

        if (data && data.category) {
          try {
            const cat = encodeURIComponent(data.category)
            const res = await api.get(`/products/category/${cat}`)
            if (!mounted) return
            const rel = Array.isArray(res.data)
              ? res.data.filter(p => p.id !== data.id).slice(0, 3)
              : []
            setRelated(rel)
          } catch (err) {
            console.warn('Erro carregando relacionados', err)
            setRelated([])
          }
        }
      } catch (err) {
        console.error(err)
        if (!mounted) return
        setError('Não foi possível carregar o produto.')
      } finally {
        mounted && setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [id])

  function formatPrice(v) {
    if (typeof v === 'number') return `$${v.toFixed(2)}`
    if (typeof v === 'string' && !isNaN(Number(v))) return `$${Number(v).toFixed(2)}`
    return v
  }

  function handleAddToCart() {
    if (!isAuthenticated()) {
      navigate('/login')
      return
    }

    alert(`Adicionado ${qty}x "${product.title}" ao carrinho (demo).`)
  }

  if (loading) {
    return <div className="pd-container" style={{ padding: 40, textAlign: 'center', color: '#666' }}>Carregando produto…</div>
  }
  if (error) {
    return <div className="pd-container" style={{ padding: 40, textAlign: 'center', color: '#c00' }}>{error}</div>
  }
  if (!product) return null

  const images = product.image ? [product.image] : []

  return (
    <div style={{ background: '#fbfbfb', minHeight: '100vh', padding: '28px 20px' }}>

      <div className="pd-wrap">
        <div className="pd-grid" role="main" aria-labelledby="product-title">
          <div style={{ display: 'flex', gap: 12 }}>
            <div className="media-card" style={{ flex: 1 }}>
              <div className="main-image" role="img" aria-label={product.title}>
                {images[0] ? (
                  <img src={images[selectedImageIndex]} alt={product.title} style={{ maxHeight: '88%', maxWidth: '100%', objectFit: 'contain' }} />
                ) : (
                  <svg width="220" height="220" viewBox="0 0 220 220" aria-hidden>
                    <rect width="220" height="220" rx="12" fill="#efefef" />
                    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="#bfbfbf" fontSize="16" fontFamily="Arial">SEM IMAGEM</text>
                  </svg>
                )}
              </div>
            </div>

            <div className="thumbs" aria-hidden>
              {(images.length > 0 ? images : [null]).map((src, i) => (
                <div
                  key={i}
                  className={`thumb ${i === selectedImageIndex ? 'active' : ''}`}
                  onClick={() => setSelectedImageIndex(i)}
                  onKeyDown={(e) => { if (e.key === 'Enter') setSelectedImageIndex(i) }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Imagem ${i + 1}`}
                >
                  {src ? <img src={src} alt={`${product.title} ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ color: '#777', fontWeight: 800 }}>IMG</div>}
                </div>
              ))}
            </div>
          </div>

          <div className="info-card">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="category-badge">{product.category ?? '—'}</div>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className="rating" title={`Avaliação ${product.rating?.rate ?? '—'}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M12 17.3L5.3 21l1.1-6.5L1 9.9l6.6-.9L12 3l2.4 6.1 6.6.9-5.4 4.6L18.7 21 12 17.3z" fill="#bfbfbf"/></svg>
                    <span style={{ fontWeight: 800, color: '#444' }}>{product.rating?.rate ?? '—'}</span>
                    <span style={{ color: '#bbb' }}>•</span>
                    <span style={{ color: '#999', fontSize: 13 }}>{product.rating?.count ?? 0} avaliações</span>
                  </div>
                </div>
              </div>

              <h1 id="product-title" className="title">{product.title}</h1>
              <p className="desc">{product.description}</p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="price">{formatPrice(product.price)}</div>
                {product?.rating && <div style={{ color: '#777' }}>Avaliação: {product.rating.rate} / 5</div>}
              </div>
            </div>

            <div className="controls" role="group" aria-label="Opções de compra">
              <div className="qty" aria-label="Quantidade">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Diminuir quantidade">−</button>
                <span aria-live="polite">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} aria-label="Aumentar quantidade">+</button>
              </div>

              <button className="btn-primary" onClick={handleAddToCart}>
                {isAuthenticated() ? 'Adicionar ao carrinho' : 'Entrar para comprar'}
              </button>

              <button className="btn-ghost" onClick={() => navigator.share ? navigator.share({ title: product.title, text: product.description }) : alert('Compartilhar (demo)')}>
                Compartilhar
              </button>
            </div>

            <div className="meta-row" aria-hidden>
              <div style={{ padding: '6px 8px', borderRadius: 8, background: '#fbfbfb', border: '1px solid #efefef', fontWeight: 800, color: '#666' }}>Frete a partir de $12</div>
              <div style={{ padding: '6px 8px', borderRadius: 8, background: '#fbfbfb', border: '1px solid #efefef', fontWeight: 800, color: '#666' }}>Devolução em 30 dias</div>
              <div style={{ marginLeft: 'auto', color: '#777', fontSize: 13 }}>Pagamentos: Cartão • Pix • Boleto</div>
            </div>
            
            {related.length > 0 && (
              <div style={{ marginTop: 18 }}>
                <h4 style={{ margin: '6px 0' }}>Produtos relacionados</h4>
                <div className="related-grid">
                  {related.map(r => (
                    <Link key={r.id} to={`/produtos/${r.id}`} className="related-item" aria-label={r.title}>
                      <div className="related-thumb">
                        {r.image ? <img src={r.image} alt={r.title} style={{ maxHeight: 110, objectFit: 'contain' }} /> : <div style={{ color: '#777' }}>IMG</div>}
                      </div>
                      <div style={{ fontWeight: 800, color: '#111' }}>{r.title}</div>
                      <div style={{ color: '#777' }}>{formatPrice(r.price)}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
