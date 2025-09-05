from flask import Blueprint, request, jsonify
from src.models.user import User, db
from werkzeug.security import generate_password_hash
import uuid
import jwt
import os

user_bp = Blueprint("user", __name__)

def get_current_user():
    """Helper function to get current user from token"""
    token = request.headers.get('x-access-token')
    if not token:
        return None
    
    try:
        secret_key = os.environ.get('JWT_SECRET_KEY', 'asdf#FGSgvasgf$5$WGT')
        data = jwt.decode(token, secret_key, algorithms=['HS256'])
        current_user = User.query.filter_by(id=data['id']).first()
        return current_user
    except Exception as e:
        return None

@user_bp.route("/register", methods=["POST"])
def register_user():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    confirm_password = data.get("confirm_password")

    if not username or not email or not password or not confirm_password:
        return jsonify({"message": "Todos os campos são obrigatórios"}), 400

    if password != confirm_password:
        return jsonify({"message": "As senhas não coincidem"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"message": "Nome de usuário já existe"}), 409

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email já está em uso"}), 409

    # Gerar um novo family_id para o usuário
    family_id = str(uuid.uuid4())

    new_user = User(
        username=username,
        email=email,
        family_id=family_id,
    )
    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Usuário registrado com sucesso", "family_id": family_id}), 201

@user_bp.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users]), 200

@user_bp.route("/users/family-id", methods=["GET"])
def get_family_id():
    """Get current user's family ID"""
    current_user = get_current_user()
    if not current_user:
        return jsonify({"error": "Token inválido ou não fornecido"}), 401
    
    return jsonify({"family_id": current_user.family_id}), 200

@user_bp.route("/users/family-id", methods=["PUT"])
def update_family_id():
    """Update user's family ID to join another family"""
    current_user = get_current_user()
    if not current_user:
        return jsonify({"error": "Token inválido ou não fornecido"}), 401
    
    data = request.get_json()
    new_family_id = data.get("family_id")
    
    if not new_family_id:
        return jsonify({"error": "Family ID é obrigatório"}), 400
    
    current_user.family_id = new_family_id
    db.session.commit()
    
    return jsonify({"message": "Family ID atualizado com sucesso", "family_id": new_family_id}), 200


