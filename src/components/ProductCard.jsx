import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  return (
    <div style={{ border: '1px solid #e5e5e5', borderRadius: 8, padding: 16, background: '#fff' }}>
      <Link to={`/produtos/${product.id}`} style={{ display: 'block', color: 'inherit' }}>
        <div style={{ display: 'grid', placeItems: 'center', height: 160, marginBottom: 12 }}>
          <img src={product.image} alt={product.title} style={{ maxHeight: 160, objectFit: 'contain' }} />
        </div>
        <h3 style={{ fontSize: 16, margin: '0 0 8px 0', color: '#111' }}>{product.title}</h3>
        <p style={{ margin: 0, color: '#444' }}>${product.price}</p>
      </Link>
    </div>
  )
}


