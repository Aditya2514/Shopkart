import axios from 'axios'

// In production on Vercel, requests use '/api' to hit the serverless function seamlessly on the same origin.
// In local development, it defaults to 'http://localhost:8085' unless VITE_API_URL is explicitly configured.
const baseURL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:8085')

const api = axios.create({
  baseURL,
  withCredentials: true,
})

export default api
