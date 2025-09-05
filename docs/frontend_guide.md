# Guia de Uso e Manutenção do Frontend

Este documento resume as melhores práticas, estrutura e instruções para manter o frontend moderno, robusto e confiável.

## Estrutura de Serviços
- `src/services/auth.js`: login, registro, logout.
- `src/services/dashboard.js`: dados do dashboard.
- `src/services/transactions.js`: listar, criar, deletar transações.
- `src/services/reports.js`: dados de relatórios financeiros.

## Boas Práticas
- Centralize chamadas à API nos serviços.
- Sempre trate erros e loading nos componentes.
- Use componentes reutilizáveis para UI (cards, buttons, forms, alerts, modais, sidebar).
- Garanta responsividade e acessibilidade.
- Teste todos os fluxos após alterações.

## Testes e Revisão
- Após cada alteração, revise visualmente e funcionalmente todos os fluxos principais:
  - Autenticação (Login/Register/Logout)
  - Navegação (Layout/Sidebar)
  - Dashboard (gráficos, cards)
  - Lançamentos (formulário, listagem, exclusão)
  - Relatórios (filtros, gráficos, exportação)
- Verifique integração com backend e feedback visual.

## Manutenção
- Atualize dependências regularmente.
- Documente novas funções e fluxos.
- Mantenha o código limpo e padronizado.

---
Seguindo este guia, o frontend permanecerá moderno, seguro e fácil de evoluir.
