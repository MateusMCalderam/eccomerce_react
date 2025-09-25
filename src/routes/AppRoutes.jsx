import { createBrowserRouter, RouterProvider, redirect } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout.jsx'
import Home from '../pages/Home.jsx'
import Login from '../pages/Login.jsx'
import Products from '../pages/Products.jsx'
import ProductDetail from '../pages/ProductDetail.jsx'
import NotFound from '../pages/NotFound.jsx'

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/login', element: <Login /> },
      { path: '/produtos', element: <Products /> },
      { path: '/produtos/:id', element: <ProductDetail /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

export default function AppRoutes() {
  return <RouterProvider router={router} />
}


