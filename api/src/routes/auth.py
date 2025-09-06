from flask import Blueprint, request, jsonify
import jwt
import os
from functools import wraps
from src.models.user import User
from src.models import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

auth_bp = Blueprint("auth", __name__)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "x-access-token" in request.headers:
            token = request.headers["x-access-token"]

        if not token:
            return jsonify({"message": "Token is missing!"}), 401

        try:
            secret_key = os.environ.get('JWT_SECRET_KEY', 'asdf#FGSgvasgf$5$WGT')
            data = jwt.decode(token, secret_key, algorithms=["HS256"])
            current_user = User.query.get(data["id"])
        except:
            return jsonify({"message": "Token is invalid!"}), 401

        return f(current_user, *args, **kwargs)

    return decorated

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({"message": "Invalid email or password"}), 401

    token = jwt.encode(
        {"id": user.id, "family_id": user.family_id},
        os.environ.get('JWT_SECRET_KEY', 'asdf#FGSgvasgf$5$WGT'),
        algorithm="HS256",
    )

    return jsonify({"token": token})

def get_current_user_family_id():
    token = request.headers.get("x-access-token")
    if not token:
        return None
    try:
        secret_key = os.environ.get('JWT_SECRET_KEY', 'asdf#FGSgvasgf$5$WGT')
        data = jwt.decode(token, secret_key, algorithms=["HS256"])
        return data.get("family_id")
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


