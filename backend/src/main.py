from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
import jwt

from . import models, database, schemas, security

app = FastAPI(title="Sentinel-Ops API", version="1.0.0")

# --- L'OUVERTURE DE LA PORTE (CORS) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Autorise Next.js à communiquer
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Badge d'accès invalide",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, security.SECRET_KEY, algorithms=[security.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user

@app.get("/health")
def health_check():
    return {"status": "online"}

@app.post("/api/v1/users", response_model=schemas.UserResponse)
def register_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    hashed_pwd = security.get_password_hash(user.password)
    new_user = models.User(email=user.email, password_hash=hashed_pwd)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/api/v1/login", response_model=schemas.Token)
def login_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not security.verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Identifiants incorrects")
    
    access_token = security.create_access_token(data={"sub": str(db_user.id)})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/v1/monitors", response_model=schemas.MonitorResponse)
def create_monitor(
    monitor: schemas.MonitorCreate, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    new_monitor = models.Monitor(
        user_id=current_user.id,
        name=monitor.name,
        target_url=monitor.target_url,
        check_interval_seconds=monitor.check_interval_seconds
    )
    db.add(new_monitor)
    db.commit()
    db.refresh(new_monitor)
    return new_monitor

# --- LA NOUVELLE ROUTE POUR LE DASHBOARD (Données en temps réel) ---
@app.get("/api/v1/dashboard")
def get_dashboard(db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    # 1. On cherche les moniteurs du client
    monitors = db.execute(text("SELECT id FROM monitors WHERE user_id = :uid AND is_active = TRUE"), {"uid": current_user.id}).fetchall()
    monitor_ids = [str(m[0]) for m in monitors]
    
    if not monitor_ids:
        return {"active_monitors": 0, "avg_response": 0, "chart_data": []}
        
    # 2. On récupère les 15 derniers pings via une requête SQL optimisée
    logs = db.execute(text("""
        SELECT TO_CHAR(checked_at, 'HH24:MI:SS') as time, response_time_ms 
        FROM ping_logs 
        WHERE monitor_id = :mid 
        ORDER BY checked_at DESC LIMIT 15
    """), {"mid": monitor_ids[0]}).fetchall()
    
    # 3. Formatage pour Recharts et inversion chrono
    chart_data = [{"time": row[0], "ms": row[1]} for row in reversed(logs)]
    avg = sum(d["ms"] for d in chart_data) // len(chart_data) if chart_data else 0
    
    return {
        "active_monitors": len(monitor_ids),
        "avg_response": avg,
        "chart_data": chart_data
    }
