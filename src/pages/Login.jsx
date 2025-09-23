import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/auth.js'

export default function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('mor_2314')
  const [password, setPassword] = useState('83r5^_')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login({ username, password })
      navigate('/produtos')
    } catch (err) {
      setError('Falha no login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ padding: '40px 0', maxWidth: 420 }}>
      <h2 style={{ margin: '0 0 16px 0' }}>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
        <label style={{ display: 'grid', gap: 6 }}>
          <span>Usuário</span>
          <input value={username} onChange={(e) => setUsername(e.target.value)} style={{ padding: '10px 12px', borderRadius: 6, border: '1px solid #ccc' }} />
        </label>
        <label style={{ display: 'grid', gap: 6 }}>
          <span>Senha</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '10px 12px', borderRadius: 6, border: '1px solid #ccc' }} />
        </label>
        {error && <div style={{ color: '#b00' }}>{error}</div>}
        <button disabled={loading} style={{ padding: '10px 12px', borderRadius: 6, border: '1px solid #111', background: '#111', color: '#fff' }}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}


