# Guia de Contribuição

Obrigado por considerar contribuir para o projeto **Finanças Familiares**! 🎉

## 🚀 Como Contribuir

### 1. Fork o Projeto
- Clique em "Fork" no GitHub
- Clone seu fork localmente

### 2. Configure o Ambiente
```bash
# Backend
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
.venv\Scripts\activate     # Windows
pip install -r requirements.txt

# Frontend
cd planner-familiar
npm install
```

### 3. Crie uma Branch
```bash
git checkout -b feature/nova-funcionalidade
```

### 4. Faça suas Alterações
- Siga os padrões de código
- Adicione testes se necessário
- Documente mudanças importantes

### 5. Teste Localmente
```bash
# Backend
python main.py

# Frontend
npm run dev
```

### 6. Commit e Push
```bash
git add .
git commit -m "feat: adiciona nova funcionalidade"
git push origin feature/nova-funcionalidade
```

### 7. Abra um Pull Request
- Descreva suas mudanças
- Referencie issues relacionadas
- Aguarde review

## 📋 Padrões de Código

### Python (Backend)
- Siga PEP 8
- Use type hints quando possível
- Documente funções complexas

### JavaScript/React (Frontend)
- Use ESLint configuration
- Componentes funcionais com hooks
- Prop types ou TypeScript

### Commits
Use conventional commits:
- `feat:` nova funcionalidade
- `fix:` correção de bug
- `docs:` documentação
- `style:` formatação
- `refactor:` refatoração
- `test:` testes

## 🐛 Reportar Bugs

1. Verifique se já não existe uma issue
2. Use o template de bug report
3. Inclua steps para reproduzir
4. Adicione screenshots se aplicável

## 💡 Sugerir Funcionalidades

1. Abra uma issue com label "enhancement"
2. Descreva o problema que resolve
3. Proponha uma solução
4. Considere alternativas

## 📝 Documentação

- Mantenha README.md atualizado
- Documente APIs no código
- Atualize CHANGELOG.md

## ✅ Checklist de PR

- [ ] Código testado localmente
- [ ] Testes passando
- [ ] Documentação atualizada
- [ ] Sem conflitos de merge
- [ ] Descrição clara do PR

## 🏆 Reconhecimento

Contribuidores serão listados no README.md e releases.

## 🤝 Código de Conduta

- Seja respeitoso e inclusivo
- Aceite feedback construtivo
- Foque no que é melhor para a comunidade

## 📬 Contato

Dúvidas? Abra uma issue com label "question".

Obrigado por contribuir! 🙏
