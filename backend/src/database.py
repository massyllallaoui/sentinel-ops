import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Récupération de la variable d'environnement DATABASE_URL

SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://sentinel_admin:sentinel_secure_pass_2026@localhost:5432/sentinel_db"
)

# Le moteur qui va physiquement parler à PostgreSQL
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# L'usine à sessions (Chaque requête HTTP aura sa propre session DB)
SessionLocal = sessionmaker(autocommit=False, autoflush= False, bind= engine)

# La classe de base pour nos futurs modèles 
Base = declarative_base()

# Dépendance pour FastAPI : Ouvre une connexion par requête et la ferme à la fin
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
