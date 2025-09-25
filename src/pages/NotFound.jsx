import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="nf-root" role="main" aria-labelledby="nf-title">

      <div className="nf-card" aria-live="polite">
        <div className="nf-left">
          <h1 id="nf-title">404 — Página não encontrada</h1>
          <p>Ops! A página que você tentou acessar não existe ou foi removida. Tente pesquisar produtos ou voltar para a página inicial.</p>

          <div className="nf-cta" role="group" aria-label="Ações">
            <Link to="/" className="btn-primary">Ir para Home</Link>
            <Link to="/produtos" className="btn-ghost">Ver produtos</Link>
          </div>

          <p style={{ marginTop: 12, color: 'var(--muted)', fontSize: 13 }}>
            Se acha que isso é um erro, entre em contato com o suporte.
          </p>
        </div>

        <div className="nf-ill" aria-hidden>
          <svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden>
            <rect x="40" y="40" width="520" height="320" rx="18" fill="#f6f6f6"/>
            <g transform="translate(80,80)">
              <rect x="0" y="0" width="200" height="120" rx="10" fill="#ffffff" stroke="#efefef"/>
              <rect x="220" y="0" width="200" height="60" rx="10" fill="#ffffff" stroke="#efefef"/>
              <rect x="220" y="80" width="200" height="40" rx="8" fill="#ffffff" stroke="#efefef"/>
              <circle cx="360" cy="190" r="36" fill="#ffffff" stroke="#efefef"/>
              <text x="32" y="96" fill="#bfbfbf" fontSize="20" fontFamily="Arial" >404</text>
            </g>
          </svg>
        </div>
      </div>
    </main>
  )
}
