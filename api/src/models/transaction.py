from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models import db

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    family_id = db.Column(db.String(50), nullable=False)  # ID da família
    date = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    description = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    transaction_type = db.Column(db.String(20), nullable=False)  # 'receita' ou 'despesa'
    payment_method = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Transaction {self.description}: R$ {self.amount}>'

    def to_dict(self):
        return {
            'id': self.id,
            'family_id': self.family_id,
            'date': self.date.isoformat() if self.date else None,
            'description': self.description,
            'category': self.category,
            'amount': self.amount,
            'transaction_type': self.transaction_type,
            'payment_method': self.payment_method,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class CreditCard(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    family_id = db.Column(db.String(50), nullable=False)  # ID da família
    name = db.Column(db.String(100), nullable=False)
    closing_day = db.Column(db.Integer, nullable=False)  # Dia do fechamento (1-31)
    due_day = db.Column(db.Integer, nullable=False)  # Dia do vencimento (1-31)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<CreditCard {self.name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'family_id': self.family_id,
            'name': self.name,
            'closing_day': self.closing_day,
            'due_day': self.due_day,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Investment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    family_id = db.Column(db.String(50), nullable=False)  # ID da família
    date = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    asset_name = db.Column(db.String(200), nullable=False)
    broker = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Investment {self.asset_name}: R$ {self.amount}>'

    def to_dict(self):
        return {
            'id': self.id,
            'family_id': self.family_id,
            'date': self.date.isoformat() if self.date else None,
            'asset_name': self.asset_name,
            'broker': self.broker,
            'amount': self.amount,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Debt(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    family_id = db.Column(db.String(50), nullable=False)  # ID da família
    description = db.Column(db.String(200), nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    paid_amount = db.Column(db.Float, default=0)
    monthly_payment = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Debt {self.description}: R$ {self.total_amount}>'

    def to_dict(self):
        return {
            'id': self.id,
            'family_id': self.family_id,
            'description': self.description,
            'total_amount': self.total_amount,
            'paid_amount': self.paid_amount,
            'remaining_amount': self.total_amount - self.paid_amount,
            'monthly_payment': self.monthly_payment,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Goal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    family_id = db.Column(db.String(50), nullable=False)  # ID da família
    name = db.Column(db.String(200), nullable=False)
    target_amount = db.Column(db.Float, nullable=False)
    saved_amount = db.Column(db.Float, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Goal {self.name}: R$ {self.target_amount}>'

    def to_dict(self):
        return {
            'id': self.id,
            'family_id': self.family_id,
            'name': self.name,
            'target_amount': self.target_amount,
            'saved_amount': self.saved_amount,
            'progress_percentage': (self.saved_amount / self.target_amount * 100) if self.target_amount > 0 else 0,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

