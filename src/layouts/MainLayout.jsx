import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { isAuthenticated, logout } from '../services/auth.js'

export default function MainLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [auth, setAuth] = useState(isAuthenticated())
  const [mobileOpen, setMobileOpen] = useState(false)
  const [search, setSearch] = useState('')
  const getLocalCart = () => {
    try {
      const raw = localStorage.getItem('cart')
      if (!raw) return []
      return JSON.parse(raw)
    } catch {
      return []
    }
  }

  const [totalItems, setTotalItems] = useState(() =>
    getLocalCart().reduce((s, i) => s + (i.quantity || 0), 0)
  )

  useEffect(() => {
    const onStorage = () => {
      setAuth(isAuthenticated())
      const items = getLocalCart()
      setTotalItems(items.reduce((s, i) => s + (i.quantity || 0), 0))
    }

    const onCartUpdated = () => {
      const items = getLocalCart()
      setTotalItems(items.reduce((s, i) => s + (i.quantity || 0), 0))
    }

    window.addEventListener('storage', onStorage)
    window.addEventListener('cart:updated', onCartUpdated)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('cart:updated', onCartUpdated)
    }
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  function handleLogout() {
    logout()
    setAuth(false)
    navigate('/')
  }

  function handleSearchSubmit(e) {
    e.preventDefault()
    const q = search.trim()
    if (!q) {
      navigate('/produtos')
    } else {
      navigate(`/produtos?q=${encodeURIComponent(q)}`)
    }
  }

  return (
    <div className="app-root">

      <header className="app-header">
        <div className="container header-inner">
          <Link to="/" className="brand" aria-label="Ir para Início">
            <span className="logo" aria-hidden>MS</span>
            <span>Minimal Store</span>
          </Link>

          <nav className="main-nav" role="navigation" aria-label="Menu principal">
            <Link to="/produtos">Produtos</Link>
            <Link to="#">Sobre</Link>
            <Link to="#">Contato</Link>
          </nav>

          <div className="header-actions" role="group" aria-label="Ações do cabeçalho">
            <form className="search-form" onSubmit={handleSearchSubmit} role="search" aria-label="Pesquisar produtos">
              <input
                type="search"
                placeholder="Buscar produtos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Pesquisar produtos"
              />
              <button type="submit" aria-label="Pesquisar">Ir</button>
            </form>

            {auth ? (
              <>
                <button
                  className="action-btn"
                  title="Minha conta"
                  onClick={() => navigate('/perfil')}
                  aria-label="Minha conta"
                >
                  Perfil
                </button>
                <button className="action-btn" onClick={handleLogout} aria-label="Sair">
                  Sair
                </button>
              </>
            ) : (
              <button className="action-btn primary" onClick={() => navigate('/login')} aria-label="Entrar">
                Entrar
              </button>
            )}

            <Link to="#" className="cart-btn" aria-label="Ver carrinho">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M3 3h2l.4 2M7 13h10l3-8H6.4" stroke="#444" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="10" cy="20" r="1" fill="#444"/><circle cx="18" cy="20" r="1" fill="#444"/>
              </svg>
              <span style={{ fontWeight: 800 }}>Carrinho</span>
              {totalItems > 0 && <span className="cart-badge" aria-live="polite">{totalItems}</span>}
            </Link>

            <button
              className="hamburger"
              aria-label="Abrir menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(s => !s)}
            >
              <svg width="18" height="12" viewBox="0 0 20 14" fill="none" aria-hidden><path d="M0 1h20M0 7h20M0 13h20" stroke="#444" strokeWidth="1.2" strokeLinecap="round"/></svg>
            </button>
          </div>
        </div>

        <div className="mobile-drawer" style={{ display: mobileOpen ? 'block' : 'none' }} onClick={() => setMobileOpen(false)}>
          <div
            className={`mobile-panel ${mobileOpen ? 'open' : ''}`}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Menu móvel"
          >
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ fontWeight:800 }}>Menu</div>
              <button onClick={() => setMobileOpen(false)} aria-label="Fechar menu" style={{ background:'transparent', border:'none', cursor:'pointer', fontWeight:800 }}>Fechar</button>
            </div>

            <nav className="mobile-nav" role="navigation" aria-label="Menu principal">
              <Link to="/produtos" onClick={() => setMobileOpen(false)}>Produtos</Link>
              <Link to="#" onClick={() => setMobileOpen(false)}>Sobre</Link>
              <Link to="#" onClick={() => setMobileOpen(false)}>Contato</Link>
              <Link to="#" onClick={() => setMobileOpen(false)}>Carrinho ({totalItems})</Link>
            </nav>

            <div style={{ marginTop:'auto', display:'flex', gap:8 }}>
              {auth ? (
                <>
                  <Link to="/perfil" onClick={() => setMobileOpen(false)} style={{ textDecoration:'none', color:'var(--black)', fontWeight:800 }}>Perfil</Link>
                  <button onClick={() => { handleLogout(); setMobileOpen(false) }} style={{ border:'none', background:'transparent', cursor:'pointer', fontWeight:800 }}>Sair</button>
                </>
              ) : (
                <button onClick={() => { navigate('/login'); setMobileOpen(false) }} className="action-btn primary">Entrar</button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="app-main container" role="main">
        <Outlet />
      </main>

      <footer className="app-footer">
        <div className="container footer-grid" aria-label="Rodapé">
          <div>
            <div style={{ fontWeight:800, fontSize:18 }}>Minimal Store</div>
            <p style={{ color:'var(--muted)', marginTop:8 }}>Minimal Store — Peças atemporais, entrega rápida e atendimento dedicado. Compre com segurança.</p>
          </div>

          <div style={{ display:'flex', gap:48 }}>
            <div>
              <div style={{ fontWeight:800, marginBottom:8 }}>Loja</div>
              <nav style={{ display:'flex', flexDirection:'column', gap:6 }}>
                <Link to="#" style={{ color:'var(--muted)', textDecoration:'none' }}>Sobre</Link>
                <Link to="/produtos" style={{ color:'var(--muted)', textDecoration:'none' }}>Produtos</Link>
                <Link to="#" style={{ color:'var(--muted)', textDecoration:'none' }}>Contato</Link>
              </nav>
            </div>

            <div>
              <div style={{ fontWeight:800, marginBottom:8 }}>Suporte</div>
              <nav style={{ display:'flex', flexDirection:'column', gap:6 }}>
                <Link to="#" style={{ color:'var(--muted)', textDecoration:'none' }}>FAQ</Link>
                <Link to="#" style={{ color:'var(--muted)', textDecoration:'none' }}>Política de troca</Link>
                <Link to="#" style={{ color:'var(--muted)', textDecoration:'none' }}>Privacidade</Link>
              </nav>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
