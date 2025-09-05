// Configuração da URL base da API
const API_BASE_URL = import.meta.env.PROD 
  ? '/api'  // Em produção no Vercel, usa path relativo
  : 'http://localhost:5000/api';  // Em desenvolvimento, usa localhost

export { API_BASE_URL };
