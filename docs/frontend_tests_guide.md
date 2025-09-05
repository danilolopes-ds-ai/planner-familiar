# Guia de Testes Automatizados no Frontend (React)

## 1. Instalação das dependências
Execute no terminal:
```pwsh
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

## 2. Configuração básica
- Certifique-se de que o campo `test` do `package.json` está assim:
```json
"scripts": {
  "test": "jest"
}
```
- Crie um arquivo de configuração `jest.config.js` se necessário:
```js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
};
```

## 3. Exemplo de teste automatizado (Login)
Crie o arquivo `src/components/__tests__/Login.test.jsx`:
```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../Login';

describe('Login Component', () => {
  it('renderiza campos de email e senha', () => {
    render(<Login setIsAuthenticated={() => {}} />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
  });

  it('mostra erro ao tentar login sem preencher campos', async () => {
    render(<Login setIsAuthenticated={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/erro/i)).toBeInTheDocument();
  });
});
```

## 4. Executando os testes
```pwsh
npm test
```

---
Siga este guia para criar e rodar testes automatizados em todos os componentes do frontend.
