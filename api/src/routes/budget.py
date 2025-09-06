from flask import Blueprint, request, jsonify
from datetime import datetime, date
from src.models import db
from src.routes.auth import token_required
from sqlalchemy import func, extract, and_
from src.models.budget import Budget, BudgetCategory
from src.models.transaction import Transaction

budget_bp = Blueprint('budget', __name__)

@budget_bp.route('/budget/current', methods=['GET'])
@token_required
def get_current_budget(current_user):
    """Retorna o orçamento do mês atual"""
    try:
        budget = Budget.get_current_budget(current_user.family_id)
        return jsonify(budget.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@budget_bp.route('/budget/<int:year>/<int:month>', methods=['GET'])
@token_required
def get_budget_by_month(current_user, year, month):
    """Retorna o orçamento de um mês específico"""
    try:
        budget = Budget.query.filter_by(
            family_id=current_user.family_id,
            year=year,
            month=month
        ).first()
        
        if not budget:
            budget = Budget()
            budget.family_id = current_user.family_id
            budget.year = year
            budget.month = month
            db.session.add(budget)
            db.session.commit()
        
        return jsonify(budget.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@budget_bp.route('/budget', methods=['POST'])
@token_required
def create_or_update_budget(current_user):
    """Cria ou atualiza um orçamento"""
    try:
        data = request.get_json()
        month = data.get('month', date.today().month)
        year = data.get('year', date.today().year)
        
        budget = Budget.query.filter_by(
            family_id=current_user.family_id,
            month=month,
            year=year
        ).first()
        
        if not budget:
            budget = Budget()
            budget.family_id = current_user.family_id
            budget.month = month
            budget.year = year
            db.session.add(budget)
        
        # Atualizar valores
        budget.total_income = float(data.get('planned_income', 0))
        budget.total_planned = float(data.get('planned_expenses', 0))
        budget.updated_at = datetime.utcnow()
        
        db.session.commit()
        return jsonify(budget.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@budget_bp.route('/budget/<int:budget_id>/categories', methods=['POST'])
@token_required
def add_budget_category(current_user, budget_id):
    """Adiciona uma categoria ao orçamento"""
    try:
        data = request.get_json()
        
        # Verificar se o orçamento pertence à família do usuário
        budget = Budget.query.filter_by(
            id=budget_id,
            family_id=current_user.family_id
        ).first_or_404()
        
        category = BudgetCategory()
        category.budget_id = budget_id
        category.category_name = data['category_name']
        category.planned_amount = float(data['planned_amount'])
        category.color = data.get('color', '#3B82F6')
        category.description = data.get('description', '')
        category.priority = data.get('priority', 2)
        
        db.session.add(category)
        db.session.commit()
        
        return jsonify(category.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@budget_bp.route('/budget/categories/<int:category_id>', methods=['PUT'])
@token_required
def update_budget_category(current_user, category_id):
    """Atualiza uma categoria do orçamento"""
    try:
        data = request.get_json()
        
        category = BudgetCategory.query.join(Budget).filter(
            BudgetCategory.id == category_id,
            Budget.family_id == current_user.family_id
        ).first_or_404()
        
        # Atualizar campos
        category.category_name = data.get('category_name', category.category_name)
        category.planned_amount = float(data.get('planned_amount', category.planned_amount))
        category.color = data.get('color', category.color)
        category.description = data.get('description', category.description)
        category.priority = data.get('priority', category.priority)
        category.updated_at = datetime.utcnow()
        
        db.session.commit()
        return jsonify(category.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@budget_bp.route('/budget/categories/<int:category_id>', methods=['DELETE'])
@token_required
def delete_budget_category(current_user, category_id):
    """Remove uma categoria do orçamento"""
    try:
        category = BudgetCategory.query.join(Budget).filter(
            BudgetCategory.id == category_id,
            Budget.family_id == current_user.family_id
        ).first_or_404()
        
        db.session.delete(category)
        db.session.commit()
        return '', 204
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@budget_bp.route('/budget/analytics', methods=['GET'])
@token_required
def get_budget_analytics(current_user):
    """Retorna análises do orçamento"""
    try:
        # Parâmetros opcionais
        year = request.args.get('year', date.today().year, type=int)
        month = request.args.get('month', date.today().month, type=int)
        
        budget = Budget.query.filter_by(
            family_id=current_user.family_id,
            year=year,
            month=month
        ).first()
        
        if not budget:
            return jsonify({'error': 'Orçamento não encontrado'}), 404
        
        # Análises por categoria
        category_analysis = []
        for category in budget.budget_categories:
            category_data = category.to_dict()
            
            # Adicionar tendência (comparar com mês anterior)
            prev_month = month - 1 if month > 1 else 12
            prev_year = year if month > 1 else year - 1
            
            prev_spent = db.session.query(func.sum(Transaction.amount)).filter(
                Transaction.family_id == current_user.family_id,
                Transaction.transaction_type == 'despesa',
                Transaction.category == category.category_name,
                extract('month', Transaction.date) == prev_month,
                extract('year', Transaction.date) == prev_year
            ).scalar() or 0
            
            if prev_spent > 0:
                trend = ((category_data['actual_spent'] - prev_spent) / prev_spent) * 100
                category_data['trend'] = round(trend, 1)
                category_data['trend_direction'] = 'up' if trend > 0 else 'down' if trend < 0 else 'stable'
            else:
                category_data['trend'] = 0
                category_data['trend_direction'] = 'stable'
            
            category_analysis.append(category_data)
        
        # Resumo geral
        budget_data = budget.to_dict()
        
        # Projeção para o final do mês
        days_in_month = (date(year, month + 1, 1) - date(year, month, 1)).days if month < 12 else (date(year + 1, 1, 1) - date(year, month, 1)).days
        current_day = date.today().day if date.today().month == month and date.today().year == year else days_in_month
        
        if current_day > 0:
            daily_avg_expense = budget_data['actual_expenses'] / current_day
            projected_month_expense = daily_avg_expense * days_in_month
            budget_data['projected_month_expense'] = round(projected_month_expense, 2)
            budget_data['projection_vs_budget'] = round((projected_month_expense / budget.planned_expenses * 100), 1) if budget.planned_expenses > 0 else 0
        
        return jsonify({
            'budget_overview': budget_data,
            'categories': category_analysis,
            'insights': get_budget_insights(budget, category_analysis)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@budget_bp.route('/budget/suggestions', methods=['GET'])
@token_required
def get_budget_suggestions(current_user):
    """Retorna sugestões de orçamento baseadas no histórico"""
    try:
        # Analisar últimos 3 meses para criar sugestões
        suggestions = []
        current_date = date.today()
        
        # Categorias mais gastadas nos últimos 3 meses
        category_averages = db.session.query(
            Transaction.category,
            func.avg(func.sum(Transaction.amount)).label('avg_amount')
        ).filter(
            Transaction.family_id == current_user.family_id,
            Transaction.transaction_type == 'despesa',
            Transaction.date >= date(current_date.year, max(1, current_date.month - 3), 1)
        ).group_by(
            Transaction.category,
            extract('month', Transaction.date),
            extract('year', Transaction.date)
        ).group_by(Transaction.category).all()
        
        for category, avg_amount in category_averages:
            suggestions.append({
                'category': category,
                'suggested_amount': round(avg_amount * 1.1, 2),  # 10% de margem
                'reason': f'Baseado na média dos últimos meses (R$ {avg_amount:.2f})',
                'confidence': 'high' if avg_amount > 100 else 'medium'
            })
        
        # Sugestão de receita baseada no histórico
        avg_income = db.session.query(func.avg(func.sum(Transaction.amount))).filter(
            Transaction.family_id == current_user.family_id,
            Transaction.transaction_type == 'receita',
            Transaction.date >= date(current_date.year, max(1, current_date.month - 3), 1)
        ).group_by(
            extract('month', Transaction.date),
            extract('year', Transaction.date)
        ).scalar() or 0
        
        return jsonify({
            'category_suggestions': suggestions,
            'suggested_income': round(avg_income, 2),
            'total_suggested_expenses': round(sum(s['suggested_amount'] for s in suggestions), 2)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_budget_insights(budget, category_analysis):
    """Gera insights sobre o orçamento"""
    insights = []
    
    # Verificar categorias em risco
    over_budget_categories = [cat for cat in category_analysis if cat['is_over_budget']]
    if over_budget_categories:
        insights.append({
            'type': 'warning',
            'title': 'Categorias acima do orçamento',
            'message': f'{len(over_budget_categories)} categoria(s) excederam o orçamento planejado.',
            'categories': [cat['category_name'] for cat in over_budget_categories]
        })
    
    # Verificar categorias com boa economia
    efficient_categories = [cat for cat in category_analysis if cat['percentage_used'] < 70 and cat['planned_amount'] > 0]
    if efficient_categories:
        insights.append({
            'type': 'success',
            'title': 'Boa economia',
            'message': f'{len(efficient_categories)} categoria(s) estão bem abaixo do orçamento.',
            'categories': [cat['category_name'] for cat in efficient_categories]
        })
    
    # Verificar tendências preocupantes
    trending_up = [cat for cat in category_analysis if cat.get('trend', 0) > 20]
    if trending_up:
        insights.append({
            'type': 'info',
            'title': 'Gastos em alta',
            'message': f'{len(trending_up)} categoria(s) tiveram aumento significativo comparado ao mês anterior.',
            'categories': [cat['category_name'] for cat in trending_up]
        })
    
    return insights
