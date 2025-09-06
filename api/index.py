import sys
import os

# Adicionar o diretório atual ao path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from main import app

# Exportar o app para o Vercel
application = app

if __name__ == "__main__":
    app.run()
