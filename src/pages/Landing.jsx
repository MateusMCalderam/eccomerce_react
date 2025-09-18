import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div>
      {/* Hero */}
      <section style={{ position: 'relative', background: 'linear-gradient(180deg, #111, #1a1a1a)', color: '#fff', overflow: 'hidden' }}>
        {/* shapes */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.06), transparent 60%)', top: -60, left: -40 }} />
          <div style={{ position: 'absolute', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.05), transparent 60%)', bottom: -100, right: -80 }} />
          <div style={{ position: 'absolute', width: '140%', height: 140, left: '-20%', top: 220, background: 'linear-gradient(90deg, rgba(255,255,255,0.06), transparent 60%)', transform: 'rotate(-6deg)' }} />
        </div>
        <div className="container" style={{ padding: '96px 0 72px 0', textAlign: 'center', position: 'relative' }}>
          <h1 style={{ fontSize: 56, margin: '0 0 12px 0', letterSpacing: -1 }}>Minimal Store</h1>
          <p style={{ color: '#bfbfbf', margin: '0 0 28px 0' }}>
            Essencial, clean e funcional. Preto, branco e cinza.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link to="/produtos" style={{ display: 'inline-block', padding: '12px 20px', background: '#fff', color: '#111', borderRadius: 8 }}>Explorar produtos</Link>
            <Link to="/login" style={{ display: 'inline-block', padding: '12px 20px', background: '#2a2a2a', color: '#fff', borderRadius: 8, border: '1px solid #3a3a3a' }}>Entrar</Link>
          </div>
        </div>
      </section>

      {/* Banners */}
      <section style={{ background: '#f7f7f7' }}>
        <div className="container" style={{ padding: '40px 0', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
          <div style={{ position: 'relative', background: 'linear-gradient(135deg, #eaeaea, #f5f5f5)', border: '1px solid #e5e5e5', borderRadius: 12, padding: 24, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', width: 280, height: 280, right: -60, bottom: -80, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,0,0,0.05), transparent 60%)' }} />
            <h3 style={{ marginTop: 0, marginBottom: 8 }}>Coleção Essentials</h3>
            <p style={{ color: '#555', marginTop: 0 }}>Peças neutras para o dia a dia.</p>
            <Link to="/produtos" style={{ marginTop: 8, display: 'inline-block', color: '#111', border: '1px solid #111', padding: '8px 12px', borderRadius: 8 }}>Ver coleção</Link>
          </div>
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ position: 'relative', background: 'linear-gradient(135deg, #f0f0f0, #fafafa)', border: '1px solid #e5e5e5', borderRadius: 12, padding: 20 }}>
              <h4 style={{ margin: 0 }}>Frete grátis</h4>
              <p style={{ margin: '4px 0 0 0', color: '#666' }}>Em pedidos acima de $50</p>
            </div>
            <div style={{ position: 'relative', background: 'linear-gradient(135deg, #ededed, #f9f9f9)', border: '1px solid #e5e5e5', borderRadius: 12, padding: 20 }}>
              <h4 style={{ margin: 0 }}>Devolução fácil</h4>
              <p style={{ margin: '4px 0 0 0', color: '#666' }}>30 dias para trocar</p>
            </div>
          </div>
        </div>
      </section>

      {/* Destaques */}
      <section style={{ background: '#fff' }}>
        <div className="container" style={{ padding: '40px 0', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[1,2,3].map((i) => (
            <div key={i} style={{ position: 'relative', border: '1px solid #eee', borderRadius: 12, padding: 24, background: 'linear-gradient(180deg, #fff, #f7f7f7)' }}>
              <h4 style={{ marginTop: 0 }}>Linha {i}</h4>
              <p style={{ margin: '8px 0 0 0', color: '#666' }}>Minimal e atemporal</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}


