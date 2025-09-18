import api from './api.js'

export async function login({ username, password }) {
  const { data } = await api.post('/auth/login', { username, password })
  if (data && data.token) {
    localStorage.setItem('token', data.token)
  }
  return data
}

export function logout() {
  localStorage.removeItem('token')
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem('token'))
}

export function getToken() {
  return localStorage.getItem('token') || ''
}


