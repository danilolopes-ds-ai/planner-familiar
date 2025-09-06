from flask import Blueprint, request, jsonify
from datetime import datetime, date
from src.models import db
from src.models.transaction import Transaction, CreditCard, Investment, Debt, Goal
from src.routes.auth import token_required, get_current_user_family_id
from sqlalchemy import func, extract

transactions_bp = Blueprint('transactions', __name__)

@transactions_bp.route('/transactions', methods=['GET'])
@token_required
def get_transactions(current_user):
    transactions = Transaction.query.filter_by(family_id=current_user.family_id).all()
    return jsonify([transaction.to_dict() for transaction in transactions])

@transactions_bp.route('/transactions', methods=['POST'])
@token_required
def create_transaction(current_user):
    data = request.get_json()
    
    # Converter string de data para objeto date
    transaction_date = datetime.strptime(data['date'], '%Y-%m-%d').date()
    
    transaction = Transaction()
    transaction.family_id = current_user.family_id
    transaction.date = transaction_date
    transaction.description = data['description']
    transaction.category = data['category']
    transaction.amount = float(data['amount'])
    transaction.transaction_type = data['transaction_type']
    transaction.payment_method = data['payment_method']
    
    db.session.add(transaction)
    db.session.commit()
    
    return jsonify(transaction.to_dict()), 201

@transactions_bp.route('/transactions/<int:transaction_id>', methods=['DELETE'])
@token_required
def delete_transaction(current_user, transaction_id):
    transaction = Transaction.query.filter_by(
        id=transaction_id, 
        family_id=current_user.family_id
    ).first_or_404()
    
    db.session.delete(transaction)
    db.session.commit()
    return '', 204

@transactions_bp.route('/dashboard/summary', methods=['GET'])
@token_required
def get_dashboard_summary(current_user):
    # Obter mês e ano atual
    current_month = date.today().month
    current_year = date.today().year
    
    # Receitas do mês atual
    total_income = db.session.query(func.sum(Transaction.amount)).filter(
        Transaction.family_id == current_user.family_id,
        Transaction.transaction_type == 'receita',
        extract('month', Transaction.date) == current_month,
        extract('year', Transaction.date) == current_year
    ).scalar() or 0
    
    # Despesas do mês atual
    total_expenses = db.session.query(func.sum(Transaction.amount)).filter(
        Transaction.family_id == current_user.family_id,
        Transaction.transaction_type == 'despesa',
        extract('month', Transaction.date) == current_month,
        extract('year', Transaction.date) == current_year
    ).scalar() or 0
    
    # Saldo
    balance = total_income - total_expenses
    
    # Despesas por categoria (mês atual)
    expenses_by_category = db.session.query(
        Transaction.category,
        func.sum(Transaction.amount).label('total')
    ).filter(
        Transaction.family_id == current_user.family_id,
        Transaction.transaction_type == 'despesa',
        extract('month', Transaction.date) == current_month,
        extract('year', Transaction.date) == current_year
    ).group_by(Transaction.category).all()
    
    # Evolução dos últimos 6 meses
    monthly_evolution = []
    for i in range(6):
        month_date = date.today().replace(day=1)
        if month_date.month - i <= 0:
            target_month = 12 + (month_date.month - i)
            target_year = month_date.year - 1
        else:
            target_month = month_date.month - i
            target_year = month_date.year
        
        month_income = db.session.query(func.sum(Transaction.amount)).filter(
            Transaction.family_id == current_user.family_id,
            Transaction.transaction_type == 'receita',
            extract('month', Transaction.date) == target_month,
            extract('year', Transaction.date) == target_year
        ).scalar() or 0
        
        month_expenses = db.session.query(func.sum(Transaction.amount)).filter(
            Transaction.family_id == current_user.family_id,
            Transaction.transaction_type == 'despesa',
            extract('month', Transaction.date) == target_month,
            extract('year', Transaction.date) == target_year
        ).scalar() or 0
        
        monthly_evolution.append({
            'month': f"{target_month:02d}/{target_year}",
            'income': month_income,
            'expenses': month_expenses
        })
    
    monthly_evolution.reverse()  # Ordem cronológica
    
    return jsonify({
        'total_income': total_income,
        'total_expenses': total_expenses,
        'balance': balance,
        'expenses_by_category': [{'category': cat, 'amount': float(total)} for cat, total in expenses_by_category],
        'monthly_evolution': monthly_evolution
    })

# Rotas para Cartões de Crédito
@transactions_bp.route('/credit-cards', methods=['GET'])
@token_required
def get_credit_cards(current_user):
    cards = CreditCard.query.filter_by(family_id=current_user.family_id).all()
    return jsonify([card.to_dict() for card in cards])

@transactions_bp.route('/credit-cards', methods=['POST'])
@token_required
def create_credit_card(current_user):
    data = request.get_json()
    
    card = CreditCard()
    card.family_id = current_user.family_id
    card.name = data['name']
    card.closing_day = int(data['closing_day'])
    card.due_day = int(data['due_day'])
    
    db.session.add(card)
    db.session.commit()
    
    return jsonify(card.to_dict()), 201

@transactions_bp.route('/credit-cards/<int:card_id>', methods=['DELETE'])
@token_required
def delete_credit_card(current_user, card_id):
    card = CreditCard.query.filter_by(id=card_id, family_id=current_user.family_id).first()
    
    if not card:
        return jsonify({'error': 'Cartão não encontrado'}), 404
    
    db.session.delete(card)
    db.session.commit()
    
    return jsonify({'message': 'Cartão excluído com sucesso'}), 200

# Rotas para Investimentos
@transactions_bp.route('/investments', methods=['GET'])
@token_required
def get_investments(current_user):
    investments = Investment.query.filter_by(family_id=current_user.family_id).all()
    return jsonify([investment.to_dict() for investment in investments])

@transactions_bp.route('/investments', methods=['POST'])
@token_required
def create_investment(current_user):
    data = request.get_json()
    
    investment_date = datetime.strptime(data['date'], '%Y-%m-%d').date()
    
    investment = Investment()
    investment.family_id = current_user.family_id
    investment.date = investment_date
    investment.asset_name = data['asset_name']
    investment.broker = data['broker']
    investment.amount = float(data['amount'])
    
    db.session.add(investment)
    db.session.commit()
    
    return jsonify(investment.to_dict()), 201

@transactions_bp.route('/investments/summary', methods=['GET'])
@token_required
def get_investments_summary(current_user):
    total_invested = db.session.query(func.sum(Investment.amount)).filter_by(
        family_id=current_user.family_id
    ).scalar() or 0
    
    # Evolução mensal dos aportes
    monthly_investments = db.session.query(
        func.strftime('%Y-%m', Investment.date).label('month'),
        func.sum(Investment.amount).label('total')
    ).filter_by(
        family_id=current_user.family_id
    ).group_by(func.strftime('%Y-%m', Investment.date)).order_by('month').all()
    
    return jsonify({
        'total_invested': total_invested,
        'monthly_evolution': [{'month': month, 'amount': float(total)} for month, total in monthly_investments]
    })

# Rotas para Dívidas
@transactions_bp.route('/debts', methods=['GET'])
@token_required
def get_debts(current_user):
    debts = Debt.query.filter_by(family_id=current_user.family_id).all()
    return jsonify([debt.to_dict() for debt in debts])

@transactions_bp.route('/debts', methods=['POST'])
@token_required
def create_debt(current_user):
    data = request.get_json()
    
    debt = Debt()
    debt.family_id = current_user.family_id
    debt.description = data['description']
    debt.total_amount = float(data['total_amount'])
    debt.paid_amount = float(data.get('paid_amount', 0))
    debt.monthly_payment = float(data['monthly_payment'])
    
    db.session.add(debt)
    db.session.commit()
    
    return jsonify(debt.to_dict()), 201

# Rotas para Metas
@transactions_bp.route('/goals', methods=['GET'])
@token_required
def get_goals(current_user):
    goals = Goal.query.filter_by(family_id=current_user.family_id).all()
    return jsonify([goal.to_dict() for goal in goals])

@transactions_bp.route('/goals', methods=['POST'])
@token_required
def create_goal(current_user):
    data = request.get_json()
    
    goal = Goal()
    goal.family_id = current_user.family_id
    goal.name = data['name']
    goal.target_amount = float(data['target_amount'])
    goal.saved_amount = float(data.get('saved_amount', 0))
    
    db.session.add(goal)
    db.session.commit()
    
    return jsonify(goal.to_dict()), 201

@transactions_bp.route('/goals/<int:goal_id>/update', methods=['PUT'])
@token_required
def update_goal_progress(current_user, goal_id):
    goal = Goal.query.filter_by(
        id=goal_id, 
        family_id=current_user.family_id
    ).first_or_404()
    
    data = request.get_json()
    goal.saved_amount = float(data['saved_amount'])
    db.session.commit()
    
    return jsonify(goal.to_dict())

