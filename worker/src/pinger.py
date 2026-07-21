import time
import os
import requests
from sqlalchemy import create_engine, text

DB_URL = os.getenv("DATABASE_URL", "postgresql://sentinel_admin:sentinel_secure_pass_2026@database:5432/sentinel_db")
engine = create_engine(DB_URL)

def ping_all_servers():
    print("🔍 Démarrage du cycle de ping...", flush=True)
    with engine.connect() as conn:
        # Récupération de tous les serveurs cibles
        monitors = conn.execute(text("SELECT id, target_url FROM monitors WHERE is_active = TRUE")).fetchall()
        
        for row in monitors:
            monitor_id = row[0]
            url = row[1]
            
            try:
                start_time = time.time()
                response = requests.get(url, timeout=5)
                response_time = int((time.time() - start_time) * 1000)
                status_code = response.status_code
            except requests.RequestException:
                response_time = 0
                status_code = 0 # 0 = Serveur Down

            # Sauvegarde du log dans PostgreSQL
            conn.execute(
                text("INSERT INTO ping_logs (monitor_id, status_code, response_time_ms) VALUES (:m_id, :code, :time)"),
                {"m_id": monitor_id, "code": status_code, "time": response_time}
            )
            conn.commit()
            
            statut = "🟢 LIGNE" if status_code == 200 else "🔴 DOWN"
            print(f"[{statut}] {url} | Code: {status_code} | Temps: {response_time}ms", flush=True)

if __name__ == "__main__":
    print("🚀 Worker Sentinel-Ops allumé. En attente de cibles...", flush=True)
    while True:
        ping_all_servers()
        time.sleep(60) # Pause d'une minute entre chaque cycle
