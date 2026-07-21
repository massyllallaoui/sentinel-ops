import os
from datetime import datetime, timedelta
import jwt
from passlib.context import CryptContext

# Configuration de la clé secrète (utilisée pour signer les JWT)
SECRET_KEY = os.getenv("SECRET_KEY", "clé_ultra_secrète_pour_le_developpement_2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# Initialisation du moteur Bcrypt

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str: 
    """ Transforme un mot de passe en clair en hash indéchiffrable"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Vérifie si le mot de passe fourni correspond au hash en base de données"""
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    """Génère un badge JWT valide pour une durée déterminée"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    # Le Token est signé avec notre clé secrète pour empêcher toute falsification
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt