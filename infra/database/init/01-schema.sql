-- 1. Activation de l'extension pour générer des UUID sécurisés
CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; 

-- 2. Création de la table users (utilisateurs)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    tier VARCHAR(50) DEFAULT 'free', -- free, pro, enterprise
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Table des Moniteurs (Les serveurs à surveiller)
CREATE TABLE monitors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- ex: "API EasyPark Production"
    target_url VARCHAR(2048) NOT NULL,
    check_interval_seconds INTEGER DEFAULT 60, -- Fréquence du ping
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Table des Logs (Résultats des pings en temps réel)
CREATE TABLE ping_logs (
    id BIGSERIAL PRIMARY KEY, -- BIGSERIAL car on va générer des millions de logs
    monitor_id UUID NOT NULL REFERENCES monitors(id) ON DELETE CASCADE,
    status_code INTEGER, -- ex: 200 (OK), 404, 500 (Erreur)
    response_time_ms INTEGER, 
    checked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index pour accélérer et optimiser les requetes de l'API (Lecture du dashboard)
CREATE INDEX idx_monitors_user_id ON monitors(user_id);
CREATE INDEX idx_ping_logs_monitor_id_time ON ping_logs(monitor_id, checked_at DESC)
