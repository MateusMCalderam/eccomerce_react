import api from './api.js'

export async function getAllProducts() {
  const { data } = await api.get('/products')
  return data
}

export async function getProductById(productId) {
  const { data } = await api.get(`/products/${productId}`)
  return data
}

export async function getCategories() {
  const { data } = await api.get('/products/categories')
  return data
}

export async function getByCategory(category) {
  const { data } = await api.get(`/products/category/${encodeURIComponent(category)}`)
  return data
}


