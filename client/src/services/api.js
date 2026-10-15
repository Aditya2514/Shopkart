import axios from 'axios'

// Dynamically detect if we are in local development vs deployed in production (e.g. on Vercel)
const isLocalhost = typeof window !== 'undefined' && Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
)

// In production (Vercel), requests use '/api' on the exact same origin.
// In local dev, it falls back to 'http://localhost:8085'.
const baseURL = import.meta.env.VITE_API_URL || (isLocalhost ? 'http://localhost:8085' : '/api')

const api = axios.create({
  baseURL,
  withCredentials: true,
})

export default api
