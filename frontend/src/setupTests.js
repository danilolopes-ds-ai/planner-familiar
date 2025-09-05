import '@testing-library/jest-dom';

// Definir global.TextEncoder para ambiente de testes
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder;
}