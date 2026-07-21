from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime
import time
import requests

from .database import engine, Base, get_db
from .models import User, Monitor
from .schemas import UserCreate, UserLogin, MonitorCreate, Token
from .security import hash_password, verify_password, create_access_token

# Création des tables de la BDD au démarrage
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Sentinel Ops API")

# --- CONFIGURATION CORS ---
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

# --- ROUTE CONNEXION ---
@app.post("/api/v1/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Identifiants invalides")
    
    access_token = create_access_token(data={"sub": str(db_user.id)})
    return {"access_token": access_token, "token_type": "bearer"}

# --- ROUTE DASHBOARD (AVEC PING RÉEL) ---
@app.get("/api/v1/dashboard")
def get_dashboard(db: Session = Depends(get_db)):
    monitors = db.query(Monitor).all()
    active_count = len(monitors)
    
    latencies = []
    current_time = datetime.now().strftime("%H:%M:%S")

    for mon in monitors:
        start_time = time.time()
        try:
            response = requests.get(mon.target_url, timeout=3)
            duration = int((time.time() - start_time) * 1000)
            latencies.append(duration)
        except Exception:
            latencies.append(999)

    avg_response = int(sum(latencies) / len(latencies)) if latencies else 0

    chart_data = [
        {"time": current_time, "ms": avg_response if latencies else 0}
    ]
    
    return {
        "active_monitors": active_count,
        "avg_response": avg_response,
        "chart_data": chart_data
    }

# --- ROUTE AJOUT DE MONITEUR (SÉCURISÉE CONTRE LES CRASHES 500) ---
@app.post("/api/v1/monitors")
def add_monitor(monitor: MonitorCreate, db: Session = Depends(get_db)):
    try:
        new_mon = Monitor(
            name=monitor.name,
            target_url=monitor.target_url,
            check_interval_seconds=monitor.check_interval_seconds
        )
        db.add(new_mon)
        db.commit()
        db.refresh(new_mon)
        return {"message": "Moniteur ajouté avec succès", "id": str(new_mon.id)}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
