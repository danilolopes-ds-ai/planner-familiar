import sys
import os

# Adicionar o diretório atual ao path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Importar o app principal
from main import app

# Esta é a instância que o Vercel vai usar
app = app

if __name__ == "__main__":
    app.run(debug=True)
