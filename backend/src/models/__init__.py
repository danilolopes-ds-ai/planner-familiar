from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()

# Importar todos os modelos para garantir que sejam registrados
from .user import User
from .transaction import Transaction, CreditCard, Investment, Debt, Goal
# Temporariamente comentado para resolver importação circular
# from .budget import Budget, BudgetCategory

