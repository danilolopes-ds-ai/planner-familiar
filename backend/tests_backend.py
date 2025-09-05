import os
import pytest
from main import app, db
from flask import json

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    with app.app_context():
        db.create_all()
    with app.test_client() as client:
        yield client

@pytest.fixture(autouse=True)
def setup_and_teardown():
    # Limpa o banco antes de cada teste
    from main import app, db
    with app.app_context():
        db.drop_all()
        db.create_all()


def test_register_and_login(client):
    # Teste de registro
    response = client.post('/api/register', json={
        'username': 'teste',
        'email': 'teste@email.com',
        'password': '123456',
        'confirm_password': '123456'
    })
    assert response.status_code == 201
    data = response.get_json()
    assert 'family_id' in data

    # Teste de login
    response = client.post('/api/auth/login', json={
        'email': 'teste@email.com',
        'password': '123456'
    })
    assert response.status_code == 200
    data = response.get_json()
    assert 'token' in data


def test_create_transaction_with_currency(client):
    # Registrar e logar para obter token
    client.post('/api/register', json={
        'username': 'user2',
        'email': 'user2@email.com',
        'password': 'senha',
        'confirm_password': 'senha'
    })
    login_resp = client.post('/api/auth/login', json={
        'email': 'user2@email.com',
        'password': 'senha'
    })
    token = login_resp.get_json()['token']

    # Criar transação com moeda USD
    response = client.post('/api/transactions',
        json={
            'date': '2025-09-01',
            'description': 'Compra em dólar',
            'category': 'Viagem',
            'amount': 100.0,
            'currency': 'USD',
            'transaction_type': 'despesa',
            'payment_method': 'Cartão'
        },
        headers={'x-access-token': token}
    )
    assert response.status_code == 201
    data = response.get_json()
    assert data['currency'] == 'USD'
    assert data['amount'] == 100.0


def test_create_investment_with_currency(client):
    # Registrar e logar para obter token
    client.post('/api/register', json={
        'username': 'user3',
        'email': 'user3@email.com',
        'password': 'senha',
        'confirm_password': 'senha'
    })
    login_resp = client.post('/api/auth/login', json={
        'email': 'user3@email.com',
        'password': 'senha'
    })
    token = login_resp.get_json()['token']

    # Criar investimento em Euro
    response = client.post('/api/investments',
        json={
            'date': '2025-09-01',
            'asset_name': 'Tesouro Europeu',
            'broker': 'XP',
            'amount': 500.0,
            'currency': 'EUR'
        },
        headers={'x-access-token': token}
    )
    assert response.status_code == 201
    data = response.get_json()
    assert data['currency'] == 'EUR'
    assert data['amount'] == 500.0


def test_create_transaction_invalid_amount(client):
    client.post('/api/register', json={
        'username': 'user4',
        'email': 'user4@email.com',
        'password': 'senha',
        'confirm_password': 'senha'
    })
    login_resp = client.post('/api/auth/login', json={
        'email': 'user4@email.com',
        'password': 'senha'
    })
    token = login_resp.get_json()['token']
    # Valor negativo
    response = client.post('/api/transactions',
        json={
            'date': '2025-09-01',
            'description': 'Teste valor negativo',
            'category': 'Teste',
            'amount': -10.0,
            'currency': 'BRL',
            'transaction_type': 'despesa',
            'payment_method': 'Cartão'
        },
        headers={'x-access-token': token}
    )
    assert response.status_code == 400
    assert 'O valor da transação deve ser maior que zero.' in response.get_json()['error']
    # Moeda inválida
    response = client.post('/api/transactions',
        json={
            'date': '2025-09-01',
            'description': 'Teste moeda inválida',
            'category': 'Teste',
            'amount': 10.0,
            'currency': 'INVALID',
            'transaction_type': 'despesa',
            'payment_method': 'Cartão'
        },
        headers={'x-access-token': token}
    )
    assert response.status_code == 400
    assert 'Moeda inválida.' in response.get_json()['error']
    # Data inválida
    response = client.post('/api/transactions',
        json={
            'date': '01-09-2025',
            'description': 'Teste data inválida',
            'category': 'Teste',
            'amount': 10.0,
            'currency': 'BRL',
            'transaction_type': 'despesa',
            'payment_method': 'Cartão'
        },
        headers={'x-access-token': token}
    )
    assert response.status_code == 400
    assert 'Data inválida.' in response.get_json()['error']


def test_pagination_and_filters(client):
    client.post('/api/register', json={
        'username': 'user5',
        'email': 'user5@email.com',
        'password': 'senha',
        'confirm_password': 'senha'
    })
    login_resp = client.post('/api/auth/login', json={
        'email': 'user5@email.com',
        'password': 'senha'
    })
    token = login_resp.get_json()['token']
    # Criar várias transações
    for i in range(15):
        client.post('/api/transactions',
            json={
                'date': '2025-09-01',
                'description': f'Transação {i}',
                'category': 'Teste' if i % 2 == 0 else 'Outro',
                'amount': 10.0 + i,
                'currency': 'BRL' if i % 2 == 0 else 'USD',
                'transaction_type': 'despesa',
                'payment_method': 'Cartão'
            },
            headers={'x-access-token': token}
        )
    # Paginação
    response = client.get('/api/transactions?page=2&per_page=5', headers={'x-access-token': token})
    assert response.status_code == 200
    data = response.get_json()
    assert data['page'] == 2
    assert len(data['items']) == 5
    # Filtro por categoria
    response = client.get('/api/transactions?category=Teste', headers={'x-access-token': token})
    assert response.status_code == 200
    data = response.get_json()
    for item in data['items']:
        assert item['category'] == 'Teste'
    # Filtro por moeda
    response = client.get('/api/transactions?currency=USD', headers={'x-access-token': token})
    assert response.status_code == 200
    data = response.get_json()
    for item in data['items']:
        assert item['currency'] == 'USD'
