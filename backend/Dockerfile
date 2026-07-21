FROM python:3.10-alpine

WORKDIR /app

# Installation des dépendances système nécessaires pour compiler psycopg2
RUN apk add --no-cache gcc musl-dev postgresql-dev

# Copie et installation des dépendances Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copie du code source
COPY src/ ./src/

# Exposition du port de l'API
EXPOSE 8000

# Lancement du serveur Uvicorn
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
