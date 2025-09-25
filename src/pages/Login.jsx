import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../services/auth.js'

export default function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState(() => localStorage.getItem('lastUser') || 'mor_2314')
  const [password, setPassword] = useState('83r5^_')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(() => !!localStorage.getItem('lastUser'))

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!username.trim()) {
      setError('Por favor, insira seu usuário.')
      return
    }
    if (!password) {
      setError('Por favor, insira sua senha.')
      return
    }

    setLoading(true)
    try {
      await login({ username, password })
      if (remember) localStorage.setItem('lastUser', username)
      else localStorage.removeItem('lastUser')

      navigate('/produtos')
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Falha no login. Verifique usuário e senha.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-root">

      <div className="card" role="main" aria-labelledby="login-title">
        <h2 id="login-title">Entrar na sua conta</h2>
        <p className="lead">Acesse seus pedidos, carrinho e preferências.</p>

        <form onSubmit={handleSubmit} aria-describedby={error ? 'login-error' : undefined}>
          <label className="field">
            <span>Usuário</span>
            <input
              type="text"
              inputMode="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              aria-label="Usuário"
            />
          </label>

          <label className="field">
            <span>Senha</span>
            <div className="password-row">
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-label="Senha"
              />
              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                className="toggle-pass"
                aria-pressed={showPassword}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </label>

          <div className="extras">
            <label className="remember">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                aria-label="Lembrar usuário"
              />
              <span> Lembrar usuário</span>
            </label>

            <Link to="/recuperar-senha" className="hint">Esqueceu a senha?</Link>
          </div>

          {error && <div id="login-error" className="error" role="alert">{error}</div>}

          <div className="actions" role="group" aria-label="Ações de login">
            <button className="submit" type="submit" disabled={loading} aria-busy={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>

            <Link to="/produtos" className="link-ghost">Continuar sem entrar</Link>
          </div>

          <div className="footer-note">
            <div>Não tem conta? <Link to="/registro">Cadastre-se</Link></div>
          </div>
        </form>
      </div>
    </div>
  )
}
