import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import AppRoutes from './routes/AppRoutes.jsx'
import { CartProvider } from './services/cartContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <AppRoutes />
    </CartProvider>
  </StrictMode>,
)
