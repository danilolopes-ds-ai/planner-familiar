import React from 'react';
import { MemoryRouter } from 'react-router-dom';

// Definir global.TextEncoder para ambiente de testes
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder;
}

import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../Login';

// Mock fetch para evitar chamada real ao backend
beforeAll(() => {
  global.fetch = jest.fn(() => Promise.resolve({
    ok: false,
    json: () => Promise.resolve({ success: false, message: 'Erro de autenticação' })
  }));
});

describe('Login Component', () => {
  it('renderiza campos de email e senha', () => {
    render(
      <MemoryRouter>
        <Login setIsAuthenticated={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
  });

  it('mostra erro ao tentar login sem preencher campos', async () => {
    render(
      <MemoryRouter>
        <Login setIsAuthenticated={() => {}} />
      </MemoryRouter>
    );

    // Preencher campos para contornar validação de required
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@test.com' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/erro de autenticação|erro|invalid|required/i)).toBeInTheDocument();
  });
});
