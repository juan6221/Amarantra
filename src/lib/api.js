const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
let authToken = null

export function setAuthToken(token) {
  authToken = token
}

export function clearAuthToken() {
  authToken = null
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = {
    'Content-Type': 'application/json',
  }

  if (auth && authToken) {
    headers.Authorization = `Bearer ${authToken}`
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const text = await response.text()
  const data = text ? JSON.parse(text) : null

  if (!response.ok) {
    throw new Error(data?.message || response.statusText || 'Request failed')
  }

  return data
}

export async function get(path) {
  return request(path, { method: 'GET' })
}

export async function post(path, body, auth = true) {
  return request(path, { method: 'POST', body, auth })
}

export async function put(path, body) {
  return request(path, { method: 'PUT', body })
}

export async function del(path) {
  return request(path, { method: 'DELETE' })
}