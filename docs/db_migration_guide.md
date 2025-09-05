# Guia de Migração de Banco de Dados com Flask-Migrate (Alembic)

Este guia explica como adicionar migração automática de banco de dados ao projeto, evitando alterações manuais e facilitando futuras expansões.

## 1. Instalação
```bash
pip install flask-migrate
```

## 2. Integração básica no main.py
```python
from flask_migrate import Migrate
from src.models import db

# Após inicializar o app e db:
migrate = Migrate(app, db)
```

## 3. Inicialização das migrações
No terminal, execute:
```bash
flask db init      # Executa uma vez para criar a pasta de migrações
flask db migrate   # Gera um script de migração com base nas mudanças do modelo
flask db upgrade   # Aplica as mudanças ao banco de dados
```

## 4. Recomendações
- Sempre gere e aplique migrações após alterar modelos.
- Nunca edite o banco manualmente em produção.
- Mantenha a pasta `migrations/` sob controle de versão.

---
Com Flask-Migrate, o projeto fica pronto para evoluir sem riscos de inconsistências no banco de dados.
