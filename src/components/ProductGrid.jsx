import ProductCard from './ProductCard.jsx'

export default function ProductGrid({ products }) {
  return (
    <div className="container" style={{ padding: '24px 0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}


