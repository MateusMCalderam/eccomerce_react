import api from './api.js'

// Using Fake Shop API endpoints that rely on the user's token set in api interceptor.
export async function getCart() {
  const { data } = await api.get('/cart')
  return data
}

export async function addItemToCart(productId, quantity = 1) {
  const { data } = await api.post('/cart/items', { productId, quantity })
  return data
}

export async function updateItemQuantity(productId, quantity) {
  const { data } = await api.put(`/cart/items/${productId}`, { quantity })
  return data
}

export async function removeItemFromCart(productId) {
  const { data } = await api.delete(`/cart/items/${productId}`)
  return data
}

export async function clearCartApi() {
  const { data } = await api.delete('/cart')
  return data
}

export async function saveCart(products) {
  const { data } = await api.put('/cart', { products })
  return data
}


