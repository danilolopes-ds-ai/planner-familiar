import os
import sys

import logging
from flask import Flask, send_from_directory
from flask_cors import CORS
from src.models import db
from src.routes.user import user_bp
from src.routes.transactions import transactions_bp
from src.routes.auth import auth_bp
from src.routes.budget_simple import budget_bp

# Adiciona o diretório 'backend' ao sys.path para garantir que as importações de 'src' funcionem
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# O static_folder agora aponta para a pasta 'dist' dentro da pasta 'frontend'
# O caminho é construído a partir da localização atual do arquivo (backend/main.py)
static_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'frontend', 'dist')

app = Flask(__name__, static_folder=static_dir)

# Configuração de produção
app.config['SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'asdf#FGSgvasgf$5$WGT')

# Configuração de ambiente
flask_env = os.environ.get('FLASK_ENV', 'development')

# CORS configurado para desenvolvimento
if flask_env == 'development':
    # Durante desenvolvimento, permite todas as origens
    CORS(app, 
         resources={r"/api/*": {"origins": "*"}},
         supports_credentials=True,
         expose_headers=['Content-Type', 'x-access-token', 'Authorization'],
         allow_headers=['Content-Type', 'x-access-token', 'Authorization', 'X-Requested-With'],
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
else:
    # Em produção, usa origens específicas
    cors_origins = os.environ.get('CORS_ORIGINS', 'http://localhost:5173,http://localhost:5174').split(',')
    CORS(app,
        resources={r"/api/*": {"origins": cors_origins}},
        supports_credentials=True,
        expose_headers=['Content-Type', 'x-access-token', 'Authorization'],
        allow_headers=['Content-Type', 'x-access-token', 'Authorization'],
        methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])

app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(transactions_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(budget_bp, url_prefix='/api')

# Configuração de banco de dados
# O caminho para o banco de dados é ajustado para a nova estrutura
db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'database', 'app.db')
database_url = os.environ.get('DATABASE_URL', f"sqlite:///{db_path}")
app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)

# Configuração de logging
if flask_env == 'production':
    logging.basicConfig(level=logging.WARNING)
else:
    logging.basicConfig(level=logging.DEBUG)

with app.app_context():
    db.create_all()

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if app.static_folder is None:
        return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        index_path = os.path.join(app.static_folder, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(app.static_folder, 'index.html')
        else:
            return "index.html not found", 404

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = flask_env == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug)
