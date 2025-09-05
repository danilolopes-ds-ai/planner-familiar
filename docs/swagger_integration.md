# Integração Swagger (Flask-RESTX) - Guia Rápido

Este guia explica como adicionar documentação automática e interface interativa para sua API Flask usando Swagger via Flask-RESTX.

## 1. Instalação
```bash
pip install flask-restx
```

## 2. Exemplo de integração no main.py
```python
from flask import Flask
from flask_restx import Api

app = Flask(__name__)
api = Api(app, title="Planner Familiar API", version="1.0", description="Documentação automática das rotas")
# api.add_namespace(seu_namespace, path='/transactions')
if __name__ == "__main__":
    app.run(debug=True)
```

## 3. Exemplo de documentação de rota
```python
from flask_restx import Resource, fields, Namespace
transactions_ns = Namespace('transactions', description='Operações de transações')
transaction_model = transactions_ns.model('Transaction', {
    'id': fields.Integer,
    'date': fields.String,
    'description': fields.String,
    'category': fields.String,
    'amount': fields.Float,
    'currency': fields.String,
    'transaction_type': fields.String,
    'payment_method': fields.String,
})
@transactions_ns.route('/')
class TransactionList(Resource):
    @transactions_ns.doc('list_transactions')
    @transactions_ns.marshal_list_with(transaction_model)
    def get(self):
        pass  # Lista todas as transações
    @transactions_ns.doc('create_transaction')
    @transactions_ns.expect(transaction_model)
    def post(self):
        pass  # Cria uma nova transação
# No main.py, registre o namespace:
# api.add_namespace(transactions_ns, path='/transactions')
```

## 4. Interface Swagger
Após rodar o app, acesse `http://localhost:5000/` para ver a interface Swagger interativa.

---
Esses passos garantem documentação automática, exemplos de requisição/resposta e testes interativos. Quando quiser expandir, basta seguir este guia e adaptar para suas rotas e modelos!
