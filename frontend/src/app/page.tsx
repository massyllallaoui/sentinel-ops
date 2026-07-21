"use client";

import { useEffect, useState } from "react";
import { Activity, Server, ShieldCheck, Zap, RefreshCw, Plus } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const [data, setData] = useState({ active_monitors: 0, avg_response: 0, chart_data: [] });
  const [loading, setLoading] = useState(true);
  
  // États pour le formulaire
  const [newServerName, setNewServerName] = useState("");
  const [newServerUrl, setNewServerUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // TON TOKEN JWT ICI
  const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjY2Y5MzQ0ZS02NWEwLTRlY2ItYjVjMi1jZGYyNWY4NmRjMzkiLCJleHAiOjE3ODQ2NTkzMTR9.uiF3dvHs-XGlsYyaB3aMq8rJZaBStTq_JdmfTgTxhwM";

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/dashboard", {
        headers: { "Authorization": `Bearer ${TOKEN}` }
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (error) {
      console.error("Erreur API:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour envoyer un nouveau serveur à l'API via le bouton
  const handleAddServer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/monitors", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${TOKEN}` 
        },
        body: JSON.stringify({
          name: newServerName,
          target_url: newServerUrl,
          check_interval_seconds: 60
        })
      });
      
      if (res.ok) {
        setNewServerName("");
        setNewServerUrl("");
        fetchDashboardData(); // On rafraîchit les graphiques immédiatement
      }
    } catch (error) {
      console.error("Erreur d'ajout:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    
      
        
          
            Sentinel Ops
          
          Surveillance globale des infrastructures
        
        
          {loading ? (
            
          ) : (
            
          )}
          Temps réel
        
      

      {/* LE FORMULAIRE INTERACTIF */}
      
        
           Ajouter une cible
        
        
           setNewServerName(e.target.value)}
            required
            className="flex-1 bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
           setNewServerUrl(e.target.value)}
            required
            className="flex-1 bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          
            {isSubmitting ? "Ajout..." : "Surveiller"}
          
        
      

      
        
          
            Serveurs Surveillés
            
          
          {data.active_monitors}
        
        
        
          
            Latence Moyenne
            
          
          {data.avg_response}ms
        

        
          
            Chiffrement
            
          
          JWT Sécurisé
        
      

      
        
          
          Activité Réseau (Derniers Pings)
        
        
          
            
              
                
                  
                  
                
              
              
               `${val}ms`} />
              
              
            
          
        
      
    
  );
}
