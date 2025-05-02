import axios from 'axios'

// Configure axios to include CSRF token and accept JSON
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.withCredentials = true

// Add any other global JavaScript/TypeScript initialization here