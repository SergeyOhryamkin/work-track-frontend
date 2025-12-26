const apiUrl = import.meta.env.VITE_API_URL

if (!apiUrl) {
  // Fail fast in build/runtime if the API URL is missing
  throw new Error('VITE_API_URL is not defined')
}

export const API_BASE_URL = apiUrl
