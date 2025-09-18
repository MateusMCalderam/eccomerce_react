import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { isAuthenticated, logout } from '../services/auth.js'
import { useCart } from '../services/cartContext.jsx'

export default function MainLayout() {
  const navigate = useNavigate()
  const [auth, setAuth] = useState(isAuthenticated())
  const { totalItems } = useCart()

  useEffect(() => {
    const onStorage = () => setAuth(isAuthenticated())
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  function handleLogout() {
    logout()
    setAuth(false)
    navigate('/')
    // cart badge updates via storage listener
  }

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <header style={{ borderBottom: '1px solid #e5e5e5', background: '#fff' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0' }}>
          <Link to="/" style={{ fontWeight: 700, fontSize: 20 }}>Minimal Store</Link>
          <nav style={{ display: 'flex', gap: 16 }}>
            <Link to="/produtos">Produtos</Link>
            <Link to="/carrinho" style={{ position: 'relative' }}>
              Carrinho
              {totalItems > 0 && (
                <span style={{ position: 'absolute', top: -8, right: -12, background: '#111', color: '#fff', borderRadius: 999, padding: '0 6px', fontSize: 12 }}>
                  {totalItems}
                </span>
              )}
            </Link>
            {auth ? (
              <button onClick={handleLogout} style={{ border: '1px solid #111', background: '#111', color: '#fff', padding: '6px 10px', borderRadius: 6 }}>Logout</button>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </nav>
        </div>
      </header>
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <footer style={{ borderTop: '1px solid #e5e5e5', background: '#fafafa' }}>
        <div className="container" style={{ padding: '16px 0', color: '#666' }}>
          © {new Date().getFullYear()} Minimal Store
        </div>
      </footer>
    </div>
  )
}


