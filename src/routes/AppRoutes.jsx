import { createBrowserRouter, RouterProvider, redirect } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout.jsx'
import Landing from '../pages/Landing.jsx'
import Login from '../pages/Login.jsx'
import Products from '../pages/Products.jsx'
import ProductDetail from '../pages/ProductDetail.jsx'
import Cart from '../pages/Cart.jsx'
import NotFound from '../pages/NotFound.jsx'
import { isAuthenticated } from '../services/auth.js'

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      { path: '/', element: <Landing /> },
      { path: '/login', element: <Login /> },
      { path: '/produtos', element: <Products /> },
      { path: '/produtos/:id', element: <ProductDetail /> },
      {
        path: '/carrinho',
        element: <Cart />,
        loader: () => {
          if (!isAuthenticated()) {
            throw redirect('/login')
          }
          return null
        },
      },
      { path: '*', element: <NotFound /> },
    ],
  },
])

export default function AppRoutes() {
  return <RouterProvider router={router} />
}


