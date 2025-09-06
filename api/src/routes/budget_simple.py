from flask import Blueprint, request, jsonify
from datetime import datetime
from src.routes.auth import token_required
from src.models.budget_models import Budget, BudgetCategory

budget_bp = Blueprint('budget', __name__)

@budget_bp.route('/budget/current', methods=['GET'])
@token_required
def get_current_budget(current_user):
    """Obter orçamento atual da família"""
    try:
        budget = Budget.get_current_budget(current_user.family_id)
        
        if not budget:
            # Criar orçamento vazio para o mês atual
            current_date = datetime.now()
            budget_id = Budget.create_or_update_budget(
                current_user.family_id, 
                current_date.month, 
                current_date.year
            )
            budget = Budget.get_current_budget(current_user.family_id)
        
        # Buscar categorias do orçamento
        if budget:
            categories = BudgetCategory.get_categories_by_budget(budget['id'])
            budget['categories'] = categories
        
        return jsonify(budget), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@budget_bp.route('/budget', methods=['POST'])
@token_required
def create_or_update_budget(current_user):
    """Criar ou atualizar orçamento"""
    try:
        data = request.get_json()
        
        # Obter dados do request
        month = int(data.get('month', datetime.now().month))
        year = int(data.get('year', datetime.now().year))
        total_income = float(data.get('planned_income', 0))
        total_planned = float(data.get('planned_expenses', 0))
        
        # Criar/atualizar orçamento
        budget_id = Budget.create_or_update_budget(
            current_user.family_id,
            month,
            year, 
            total_income,
            total_planned
        )
        
        # Buscar orçamento atualizado
        budget = Budget.get_current_budget(current_user.family_id)
        
        return jsonify(budget), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@budget_bp.route('/budget/<int:budget_id>/categories', methods=['POST'])
@token_required  
def create_budget_category(current_user, budget_id):
    """Criar nova categoria de orçamento"""
    try:
        data = request.get_json()
        
        category_id = BudgetCategory.create_category(
            budget_id,
            data['category_name'],
            float(data['planned_amount']),
            data.get('color', '#3B82F6'),
            data.get('description', ''),
            data.get('priority', 2)
        )
        
        return jsonify({'id': category_id, 'message': 'Categoria criada com sucesso'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@budget_bp.route('/budget/analytics', methods=['GET'])
@token_required
def get_budget_analytics(current_user):
    """Obter análises do orçamento"""
    try:
        budget = Budget.get_current_budget(current_user.family_id)
        
        if not budget:
            return jsonify({'message': 'Nenhum orçamento encontrado'}), 404
        
        categories = BudgetCategory.get_categories_by_budget(budget['id'])
        
        # Calcular métricas básicas
        total_planned = sum(cat['planned_amount'] for cat in categories)
        total_spent = sum(cat['spent_amount'] for cat in categories)
        
        analytics = {
            'total_planned': total_planned,
            'total_spent': total_spent,
            'remaining': total_planned - total_spent,
            'categories_count': len(categories),
            'categories': categories
        }
        
        return jsonify(analytics), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@budget_bp.route('/budget/suggestions', methods=['GET'])
@token_required
def get_budget_suggestions(current_user):
    """Obter sugestões de orçamento"""
    try:
        # Sugestões básicas por enquanto
        suggestions = [
            {'category': 'Alimentação', 'suggested_amount': 800.0, 'reason': 'Baseado na média nacional'},
            {'category': 'Transporte', 'suggested_amount': 400.0, 'reason': 'Inclui combustível e manutenção'},
            {'category': 'Lazer', 'suggested_amount': 300.0, 'reason': 'Recomendado 10% da renda'},
            {'category': 'Reserva de Emergência', 'suggested_amount': 500.0, 'reason': 'Importante para imprevistos'}
        ]
        
        return jsonify(suggestions), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
