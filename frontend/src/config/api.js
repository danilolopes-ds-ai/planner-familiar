// Configuração da URL base da API
const isDevelopment = import.meta.env.DEV
const isProduction = import.meta.env.PROD

// Em produção no Vercel, por enquanto vamos usar um mock ou desabilitar as APIs
const API_BASE_URL = isDevelopment 
  ? 'http://localhost:5000/api'  // Em desenvolvimento, usa localhost
  : '/api';  // Em produção, usa path relativo (quando backend estiver configurado)

// Flag para saber se deve fazer chamadas de API reais
const ENABLE_API = isDevelopment;

export { API_BASE_URL, ENABLE_API, isDevelopment, isProduction };
