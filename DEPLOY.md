# Guia de Deploy - Finanças Familiares

## 🚀 Deploy no Vercel (Frontend)

### 1. Preparação do Projeto

```bash
cd financas-familiares
npm run build
```

### 2. Configuração no Vercel

1. Faça login no [Vercel](https://vercel.com)
2. Conecte seu repositório GitHub
3. Configure as seguintes opções:

**Build Settings:**
- Framework Preset: `Vite`
- Root Directory: `financas-familiares`
- Build Command: `npm run build`
- Output Directory: `dist`

**Environment Variables:**
```
VITE_API_URL=https://your-backend-url.herokuapp.com
```

### 3. Deploy Automático

- Cada push na branch `main` fará deploy automático
- Preview deployments para Pull Requests

## 🐍 Deploy do Backend

### Opção 1: Heroku

1. **Preparação:**
```bash
# Crie um Procfile na raiz
echo "web: python main.py" > Procfile

# Garanta que o requirements.txt está atualizado
pip freeze > requirements.txt
```

2. **Deploy:**
```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

heroku create financas-familiares-backend
heroku addons:create heroku-postgresql:hobby-dev
heroku config:set FLASK_ENV=production
heroku config:set JWT_SECRET_KEY=your-super-secure-secret
git push heroku main
```

### Opção 2: Railway

1. Acesse [Railway](https://railway.app)
2. Conecte seu repositório
3. Configure variáveis de ambiente:
   - `FLASK_ENV=production`
   - `JWT_SECRET_KEY=your-secret`
   - Railway criará PostgreSQL automaticamente

### Opção 3: Render

1. Acesse [Render](https://render.com)
2. Crie novo Web Service
3. Configure:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python main.py`

## 🔐 Variáveis de Ambiente

### Frontend (.env.local)
```
VITE_API_URL=https://your-backend-url.com
```

### Backend
```
FLASK_ENV=production
FLASK_DEBUG=False
DATABASE_URL=postgresql://...
JWT_SECRET_KEY=super-secure-key
CORS_ORIGINS=https://your-vercel-app.vercel.app
```

## 📊 Banco de Dados

### SQLite (Desenvolvimento)
- Arquivo local: `database/app.db`
- Backup automático

### PostgreSQL (Produção)
- Heroku PostgreSQL
- Railway PostgreSQL
- Supabase
- PlanetScale

### Migração de Dados
```python
# Script de migração (migration.py)
from src.models import db, User, Transaction
from flask import Flask

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://...'

with app.app_context():
    db.create_all()
    # Migre dados do SQLite se necessário
```

## 🌐 Domínio Personalizado

### Vercel
1. Vá em Project Settings → Domains
2. Adicione seu domínio
3. Configure DNS:
   - Type: `CNAME`
   - Name: `@` ou `www`
   - Value: `cname.vercel-dns.com`

### Backend
- Configure CORS para seu domínio
- Atualize `CORS_ORIGINS` nas variáveis de ambiente

## 📱 PWA e HTTPS

- Vercel fornece HTTPS automático
- PWA funciona apenas com HTTPS
- Service Worker será registrado automaticamente

## 🔍 Monitoramento

### Frontend (Vercel)
- Analytics integrado
- Error tracking
- Performance monitoring

### Backend
- Logs no dashboard do provider
- Monitoring integrado
- Database metrics

## 🚨 Troubleshooting

### Erro CORS
```python
# main.py - Atualize CORS origins
CORS(app, origins=["https://your-vercel-app.vercel.app"])
```

### Erro de Build
```bash
# Limpe cache e reinstale
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Database Connection
```python
# Verifique DATABASE_URL
import os
print(os.environ.get('DATABASE_URL'))
```

## ✅ Checklist de Deploy

- [ ] Frontend build funcionando localmente
- [ ] Backend rodando em produção
- [ ] Variáveis de ambiente configuradas
- [ ] CORS configurado corretamente
- [ ] Database migration executada
- [ ] HTTPS ativo
- [ ] PWA funcionando
- [ ] Mobile responsivo testado

## 📧 Suporte

Em caso de problemas:
1. Verifique logs do Vercel/Heroku
2. Teste localmente com variáveis de produção
3. Confirme todas as URLs e secrets
4. Teste CORS com ferramenta online
