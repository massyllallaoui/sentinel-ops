from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth, monitors  # <-- LES IMPORTS CRUCIAUX SONT ICI

# Création des tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Sentinel Ops API")

# --- LE FIX CORS ---
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

# --- CONNEXION DES ROUTEURS ---
app.include_router(auth.router, prefix="/api/v1")
app.include_router(monitors.router, prefix="/api/v1")
