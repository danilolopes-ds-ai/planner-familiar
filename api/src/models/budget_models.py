from datetime import datetime
from sqlalchemy import text
from flask import current_app
from src.models import db as global_db

# Acesso ao db através do current_app para evitar import circular
def get_db():
    """Helper para acessar db sem importação circular"""
    try:
        return current_app.extensions['sqlalchemy']
    except Exception:
        return global_db

class Budget:
    """Modelo Budget usando padrão sem importação circular"""
    
    @staticmethod
    def create_budget_table():
        """Cria a tabela budgets se não existir; ajusta schema incorreto (migração leve)."""
        db = get_db()
        with db.engine.connect() as conn:
            # Existe?
            table_exists = False
            try:
                conn.execute(text('SELECT 1 FROM budgets LIMIT 1'))
                table_exists = True
            except Exception:
                table_exists = False

            if table_exists:
                # Validar schema (family_id deve ser TEXT)
                try:
                    info = conn.execute(text('PRAGMA table_info(budgets)')).fetchall()
                    columns = {row[1]: row[2].upper() for row in info}
                    needs_migration = False
                    # family_id incorreto se INTEGER
                    if columns.get('family_id', '').startswith('INT'):
                        needs_migration = True
                    if needs_migration:
                        # Renomear e recriar
                        conn.execute(text('ALTER TABLE budgets RENAME TO budgets_old'))
                        conn.execute(text('''
                            CREATE TABLE budgets (
                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                family_id TEXT NOT NULL,
                                month INTEGER NOT NULL,
                                year INTEGER NOT NULL,
                                total_income FLOAT DEFAULT 0.0,
                                total_planned FLOAT DEFAULT 0.0,
                                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                            )
                        '''))
                        # Copiar dados possíveis
                        try:
                            conn.execute(text('''
                                INSERT INTO budgets (id, family_id, month, year, total_income, total_planned, created_at, updated_at)
                                SELECT id, CAST(family_id AS TEXT), month, year, total_income, total_planned, created_at, updated_at
                                FROM budgets_old
                            '''))
                        except Exception:
                            pass
                        conn.execute(text('DROP TABLE budgets_old'))
                        conn.commit()
                except Exception:
                    pass
            else:
                # Criar nova
                conn.execute(text('''
                    CREATE TABLE budgets (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        family_id TEXT NOT NULL,
                        month INTEGER NOT NULL,
                        year INTEGER NOT NULL,
                        total_income FLOAT DEFAULT 0.0,
                        total_planned FLOAT DEFAULT 0.0,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                '''))
                conn.commit()
    
    @staticmethod
    def get_current_budget(family_id):
        """Obter orçamento atual da família"""
        db = get_db()
        current_date = datetime.now()
        
        Budget.create_budget_table()  # Garantir que tabela existe
        
        with db.engine.connect() as conn:
            result = conn.execute(text('''
                SELECT * FROM budgets 
                WHERE family_id = :family_id 
                AND month = :month 
                AND year = :year
            '''), {
                'family_id': family_id,
                'month': current_date.month,
                'year': current_date.year
            })
            
            row = result.fetchone()
            if row:
                return {
                    'id': row[0],
                    'family_id': row[1],
                    'month': row[2], 
                    'year': row[3],
                    'total_income': row[4],
                    'total_planned': row[5],
                    'created_at': row[6],
                    'updated_at': row[7]
                }
        return None
    
    @staticmethod
    def create_or_update_budget(family_id, month, year, total_income=0.0, total_planned=0.0):
        """Criar ou atualizar orçamento"""
        db = get_db()
        Budget.create_budget_table()
        
        with db.engine.connect() as conn:
            # Verificar se já existe
            result = conn.execute(text('''
                SELECT id FROM budgets 
                WHERE family_id = :family_id AND month = :month AND year = :year
            '''), {'family_id': family_id, 'month': month, 'year': year})
            
            existing = result.fetchone()
            
            if existing:
                # Atualizar existente
                conn.execute(text('''
                    UPDATE budgets 
                    SET total_income = :total_income, 
                        total_planned = :total_planned,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = :id
                '''), {
                    'total_income': total_income,
                    'total_planned': total_planned, 
                    'id': existing[0]
                })
                budget_id = existing[0]
            else:
                # Criar novo
                result = conn.execute(text('''
                    INSERT INTO budgets (family_id, month, year, total_income, total_planned)
                    VALUES (:family_id, :month, :year, :total_income, :total_planned)
                '''), {
                    'family_id': family_id,
                    'month': month,
                    'year': year,
                    'total_income': total_income,
                    'total_planned': total_planned
                })
                budget_id = result.lastrowid
            
            conn.commit()
            return budget_id

class BudgetCategory:
    """Modelo BudgetCategory usando padrão sem importação circular"""
    
    @staticmethod
    def create_category_table():
        """Cria a tabela de categorias de orçamento dinamicamente"""
        db = get_db()
        
        try:
            with db.engine.connect() as conn:
                # Tentar consultar a tabela para ver se existe
                conn.execute(text('SELECT 1 FROM budget_categories LIMIT 1'))
        except:
            # Tabela não existe, criar
            with db.engine.connect() as conn:
                conn.execute(text('''
                    CREATE TABLE budget_categories (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        budget_id INTEGER NOT NULL,
                        category_name VARCHAR(100) NOT NULL,
                        planned_amount FLOAT DEFAULT 0.0,
                        spent_amount FLOAT DEFAULT 0.0,
                        color VARCHAR(7) DEFAULT '#3B82F6',
                        description TEXT,
                        priority INTEGER DEFAULT 2,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (budget_id) REFERENCES budgets (id) ON DELETE CASCADE
                    )
                '''))
                conn.commit()
    
    @staticmethod
    def create_category(budget_id, category_name, planned_amount, color='#3B82F6', description='', priority=2):
        """Criar nova categoria de orçamento"""
        db = get_db()
        BudgetCategory.create_category_table()
        
        with db.engine.connect() as conn:
            result = conn.execute(text('''
                INSERT INTO budget_categories 
                (budget_id, category_name, planned_amount, color, description, priority)
                VALUES (:budget_id, :category_name, :planned_amount, :color, :description, :priority)
            '''), {
                'budget_id': budget_id,
                'category_name': category_name,
                'planned_amount': planned_amount,
                'color': color,
                'description': description,
                'priority': priority
            })
            conn.commit()
            return result.lastrowid
    
    @staticmethod
    def get_categories_by_budget(budget_id):
        """Obter categorias por ID do orçamento"""
        db = get_db()
        BudgetCategory.create_category_table()
        
        with db.engine.connect() as conn:
            result = conn.execute(text('''
                SELECT * FROM budget_categories WHERE budget_id = :budget_id
                ORDER BY priority ASC, category_name ASC
            '''), {'budget_id': budget_id})
            
            categories = []
            for row in result:
                categories.append({
                    'id': row[0],
                    'budget_id': row[1],
                    'category_name': row[2],
                    'planned_amount': row[3],
                    'spent_amount': row[4],
                    'color': row[5],
                    'description': row[6],
                    'priority': row[7],
                    'created_at': row[8],
                    'updated_at': row[9]
                })
            return categories
