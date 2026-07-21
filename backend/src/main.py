from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from .database import engine, Base, get_db
from .models import User, Monitor
from .schemas import UserCreate, UserLogin, MonitorCreate, Token
from .security import hash_password, verify_password, create_access_token

# Création des tables de la BDD au démarrage
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Sentinel Ops API")

# --- CONFIGURATION CORS (Pour autoriser Vercel) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "Sentinel Ops API is live"}

# --- ROUTE INSCRIPTION ---
@app.post("/api/v1/users")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email déjà utilisé")
    
    hashed_pwd = hash_password(user.password)
    new_user = User(email=user.email, password_hash=hashed_pwd, tier="free")
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "Utilisateur créé avec succès", "id": str(new_user.id)}

# --- ROUTE CONNEXION (Génération du Token JWT) ---
@app.post("/api/v1/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Identifiants invalides")
    
    access_token = create_access_token(data={"sub": str(db_user.id)})
    return {"access_token": access_token, "token_type": "bearer"}

# --- ROUTE DASHBOARD ---
@app.get("/api/v1/dashboard")
def get_dashboard(db: Session = Depends(get_db)):
    monitors = db.query(Monitor).all()
    active_count = len(monitors)
    
    # Données simulées pour le graphique de latence
    chart_data = [
        {"time": "10:00", "ms": 45},
        {"time": "10:05", "ms": 52},
        {"time": "10:10", "ms": 38},
        {"time": "10:15", "ms": 41},
    ]
    
    return {
        "active_monitors": active_count,
        "avg_response": 44,
        "chart_data": chart_data
    }

# --- ROUTE AJOUT DE MONITEUR ---
@app.post("/api/v1/monitors")
def add_monitor(monitor: MonitorCreate, db: Session = Depends(get_db)):
    new_mon = Monitor(
        name=monitor.name,
        target_url=monitor.target_url,
        check_interval_seconds=monitor.check_interval_seconds
    )
    db.add(new_mon)
    db.commit()
    db.refresh(new_mon)
    return {"message": "Moniteur ajouté", "id": str(new_mon.id)}
