// Configuração da URL base da API
const isDevelopment = import.meta.env.DEV
const isProduction = import.meta.env.PROD

// Em produção no Vercel, usa a URL relativa para a API
const API_BASE_URL = isDevelopment 
  ? 'http://localhost:5000/api'  // Em desenvolvimento, usa localhost
  : '/api';  // Em produção, usa path relativo para a API Vercel

// Flag para saber se deve fazer chamadas de API reais
const ENABLE_API = true; // Habilitar API agora que temos backend

export { API_BASE_URL, ENABLE_API, isDevelopment, isProduction };
