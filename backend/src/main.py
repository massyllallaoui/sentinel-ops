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

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Sentinel Ops API")

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
    return {"message": "Utilisateur créé", "id": str(new_user.id)}

@app.post("/api/v1/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Identifiants invalides")
    access_token = create_access_token(data={"sub": str(db_user.id)})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/v1/dashboard")
def get_dashboard(db: Session = Depends(get_db)):
    monitors = db.query(Monitor).all()
    monitor_list = []
    latencies = []

    for mon in monitors:
        start_time = time.time()
        mon_status = "online"
        try:
            response = requests.get(mon.target_url, timeout=3)
            duration = int((time.time() - start_time) * 1000)
            if response.status_code >= 400:
                mon_status = "degraded"
            latencies.append(duration)
        except Exception:
            duration = 999
            mon_status = "offline"
            latencies.append(999)

        monitor_list.append({
            "id": str(mon.id),
            "name": mon.name,
            "target_url": mon.target_url,
            "latency": duration,
            "status": mon_status
        })

    avg_response = int(sum(latencies) / len(latencies)) if latencies else 0

    return {
        "active_monitors": len(monitors),
        "avg_response": avg_response,
        "monitors": monitor_list,
        "chart_data": [{"time": datetime.now().strftime("%H:%M:%S"), "ms": avg_response}]
    }

@app.post("/api/v1/monitors")
def add_monitor(monitor: MonitorCreate, db: Session = Depends(get_db)):
    try:
        # Récupération automatique du premier utilisateur pour satisfaire la contrainte BDD
        default_user = db.query(User).first()
        user_id = default_user.id if default_user else None

        new_mon = Monitor(
            name=monitor.name,
            target_url=monitor.target_url,
            check_interval_seconds=monitor.check_interval_seconds,
            user_id=user_id
        )
        db.add(new_mon)
        db.commit()
        db.refresh(new_mon)
        return {"message": "Moniteur ajouté avec succès", "id": str(new_mon.id)}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
