from flask import Blueprint, request, jsonify, current_app
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
    logger = current_app.logger
    try:
        data = request.get_json(force=True, silent=False) or {}
        missing = [f for f in ['date','description','category','amount','transaction_type','payment_method'] if f not in data or data[f] in (None, '')]
        if missing:
            return jsonify({'error':'validation_error','missing_fields':missing}), 400

        # Validar tipo
        if data['transaction_type'] not in ['receita','despesa']:
            return jsonify({'error':'invalid_transaction_type'}), 400

        # Converter string de data para objeto date
        try:
            transaction_date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        except Exception:
            return jsonify({'error':'invalid_date_format','expected':'YYYY-MM-DD'}), 400

        try:
            amount_value = float(str(data['amount']).replace(',','.'))
        except Exception:
            return jsonify({'error':'invalid_amount'}), 400
        
        transaction = Transaction(
            family_id=current_user.family_id,
            date=transaction_date,
            description=data['description'],
            category=data['category'],
            amount=amount_value,
            transaction_type=data['transaction_type'],
            payment_method=data['payment_method']
        )
        db.session.add(transaction)
        db.session.commit()
        return jsonify(transaction.to_dict()), 201
    except Exception as e:
        logger.exception('Erro ao criar transação')
        db.session.rollback()
        return jsonify({'error':'internal_error','detail':str(e)}), 500

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
    logger = current_app.logger
    dialect = db.session.bind.dialect.name
    logger.debug(f"Calculando dashboard summary usando dialect={dialect}")
    current_month = date.today().month
    current_year = date.today().year

    def month_filter(column, target_month):
        if dialect == 'sqlite':
            return func.strftime('%m', column) == f"{target_month:02d}"
        return extract('month', column) == target_month

    def year_filter(column, target_year):
        if dialect == 'sqlite':
            return func.strftime('%Y', column) == str(target_year)
        return extract('year', column) == target_year

    try:
        total_income = db.session.query(func.sum(Transaction.amount)).filter(
            Transaction.family_id == current_user.family_id,
            Transaction.transaction_type == 'receita',
            month_filter(Transaction.date, current_month),
            year_filter(Transaction.date, current_year)
        ).scalar() or 0

        total_expenses = db.session.query(func.sum(Transaction.amount)).filter(
            Transaction.family_id == current_user.family_id,
            Transaction.transaction_type == 'despesa',
            month_filter(Transaction.date, current_month),
            year_filter(Transaction.date, current_year)
        ).scalar() or 0

        balance = total_income - total_expenses

        expenses_by_category = db.session.query(
            Transaction.category,
            func.sum(Transaction.amount).label('total')
        ).filter(
            Transaction.family_id == current_user.family_id,
            Transaction.transaction_type == 'despesa',
            month_filter(Transaction.date, current_month),
            year_filter(Transaction.date, current_year)
        ).group_by(Transaction.category).all()

        # Últimos 6 meses
        monthly_evolution = []
        ref = date.today().replace(day=1)
        for i in range(5, -1, -1):  # ordem cronológica direta
            # calcular mês alvo retroativo
            target_year = ref.year
            target_month = ref.month - i
            while target_month <= 0:
                target_month += 12
                target_year -= 1

            month_income = db.session.query(func.sum(Transaction.amount)).filter(
                Transaction.family_id == current_user.family_id,
                Transaction.transaction_type == 'receita',
                month_filter(Transaction.date, target_month),
                year_filter(Transaction.date, target_year)
            ).scalar() or 0

            month_expenses = db.session.query(func.sum(Transaction.amount)).filter(
                Transaction.family_id == current_user.family_id,
                Transaction.transaction_type == 'despesa',
                month_filter(Transaction.date, target_month),
                year_filter(Transaction.date, target_year)
            ).scalar() or 0

            monthly_evolution.append({
                'month': f"{target_month:02d}/{target_year}",
                'income': month_income,
                'expenses': month_expenses
            })

        return jsonify({
            'total_income': total_income,
            'total_expenses': total_expenses,
            'balance': balance,
            'expenses_by_category': [{'category': cat, 'amount': float(total)} for cat, total in expenses_by_category],
            'monthly_evolution': monthly_evolution
        })
    except Exception as e:
        logger.exception('Erro ao gerar dashboard summary')
        return jsonify({'error':'internal_error','detail':str(e),'dialect':dialect}), 500

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

