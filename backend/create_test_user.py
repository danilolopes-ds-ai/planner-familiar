#!/usr/bin/env python3
import sys
import os

# Adiciona o backend ao path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from src.models.user import User
from src.models import db
from main import app

def create_test_user():
    with app.app_context():
        # Verifica se já existe o usuário teste
        existing_user = User.query.filter_by(email='teste@email.com').first()
        
        if existing_user:
            print(f"Usuário teste já existe: {existing_user.email}")
            print(f"ID: {existing_user.id}, Username: {existing_user.username}")
            return existing_user
        
        # Cria um usuário teste
        test_user = User(
            username="teste",
            email="teste@email.com",
            family_id="familia_teste"
        )
        test_user.set_password("123456")
        
        db.session.add(test_user)
        db.session.commit()
        
        print(f"Usuário teste criado com sucesso!")
        print(f"Email: {test_user.email}")
        print(f"Username: {test_user.username}")
        print(f"Senha: 123456")
        print(f"ID: {test_user.id}")
        
        return test_user

if __name__ == "__main__":
    create_test_user()
