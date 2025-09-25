import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  return (
    <div
      style={{
        border: '1px solid #e5e5e5',
        borderRadius: 12,
        padding: 16,
        background: '#fff',
        color: '#111',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <Link
        to={`/produtos/${product.id}`}
        style={{
          display: 'block',
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
        <div
          style={{
            display: 'grid',
            placeItems: 'center',
            height: 180,
            marginBottom: 16,
            background: '#f0f0f0', 
            borderRadius: 8,
          }}
        >
          <img
            src={product.image}
            alt={product.title}
            style={{
              maxHeight: 140,
              maxWidth: '90%',
              objectFit: 'contain',
              transition: 'transform 0.3s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
        </div>

        <h3
          style={{
            fontSize: 16,
            margin: '0 0 8px 0',
            fontWeight: 500,
            lineHeight: 1.4,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {product.title}
        </h3>

        <p
          style={{
            margin: '0 0 12px 0',
            fontSize: 18,
            fontWeight: 600,
            color: '#111',
          }}
        >
          ${product.price}
        </p>

        <button
          style={{
            width: '100%',
            padding: '10px 16px',
            background: '#111',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background 0.2s ease',
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = '#000')}
          onMouseOut={(e) => (e.currentTarget.style.background = '#111')}
        >
          Ver produto
        </button>
      </Link>
    </div>
  )
}
