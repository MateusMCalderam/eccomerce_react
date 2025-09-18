import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main style={{ padding: 24, textAlign: 'center' }}>
      <h1>404</h1>
      <p>Página não encontrada.</p>
      <Link to="/">Voltar para Home</Link>
    </main>
  )
}


