import { getToken } from './auth.js'

const STORAGE_KEY_PREFIX = 'cart:'

function getStorageKey() {
  const token = getToken() || 'guest'
  return STORAGE_KEY_PREFIX + token
}

export function readCart() {
  const raw = localStorage.getItem(getStorageKey())
  if (!raw) return []
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export function writeCart(items) {
  localStorage.setItem(getStorageKey(), JSON.stringify(items))
  window.dispatchEvent(new Event('storage'))
}

export function addItem(product, quantity = 1) {
  const items = readCart()
  const idx = items.findIndex((i) => i.product.id === product.id)
  if (idx >= 0) {
    items[idx].quantity += quantity
  } else {
    items.push({ product, quantity })
  }
  writeCart(items)
}

export function removeItem(productId) {
  const items = readCart().filter((i) => i.product.id !== productId)
  writeCart(items)
}

export function setQuantity(productId, quantity) {
  const items = readCart().map((i) => (i.product.id === productId ? { ...i, quantity: Math.max(1, quantity) } : i))
  writeCart(items)
}

export function clearCart() {
  writeCart([])
}

export function migrateCart(fromToken, toToken) {
  const fromKey = STORAGE_KEY_PREFIX + (fromToken || 'guest')
  const toKey = STORAGE_KEY_PREFIX + (toToken || 'guest')
  const raw = localStorage.getItem(fromKey)
  if (raw) {
    localStorage.setItem(toKey, raw)
    if (fromKey !== toKey) localStorage.removeItem(fromKey)
  }
  window.dispatchEvent(new Event('storage'))
}


