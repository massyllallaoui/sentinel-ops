"use client";
import { useState, useEffect } from "react";

const API_URL = "https://sentinel-api-c66m.onrender.com";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4NjhiOTFiNy1lYTNiLTRlMmMtODgyYi0xOGU4OTlhMTE3YTIiLCJleHAiOjE3ODQ2Nzg2MzJ9.xuaFCKWievVvZFoHNW-Jj_QHPjQ55BE16Sx1xfT1m90";

interface Monitor {
  id: string;
  name: string;
  target_url: string;
  latency: number;
  status: string;
}

export default function Dashboard() {
  const [activeMonitors, setActiveMonitors] = useState(0);
  const [avgResponse, setAvgResponse] = useState(0);
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchDashboard = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/dashboard`, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      if (res.ok) {
        const data = await res.json();
        setActiveMonitors(data.active_monitors);
        setAvgResponse(data.avg_response);
        setMonitors(data.monitors || []);
      }
    } catch (err) {
      console.error("Erreur de récupération du dashboard", err);
    }
  };

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleAddMonitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/v1/monitors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify({ name, target_url: url, check_interval_seconds: 60 }),
      });

      if (res.ok) {
        setName("");
        setUrl("");
        fetchDashboard();
      } else {
        const errData = await res.json();
        alert("Erreur API : " + (errData.detail || JSON.stringify(errData)));
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sentinel Ops</h1>
          <p className="text-slate-400 text-sm">Tableau de bord de surveillance d'infrastructure en temps réel</p>
        </div>

        {/* Formulaire d'ajout */}
        <form onSubmit={handleAddMonitor} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row gap-4 items-center">
          <input
            type="text"
            placeholder="Nom (ex: API Prod)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl w-full md:w-1/3 focus:outline-none focus:border-emerald-500"
            required
          />
          <input
            type="url"
            placeholder="URL (ex: https://api.monsite.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl w-full md:w-1/2 focus:outline-none focus:border-emerald-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-6 py-3 rounded-xl w-full md:w-auto transition-all"
          >
            {loading ? "Ajout..." : "Surveiller"}
          </button>
        </form>

        {/* Statistiques Globales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <p className="text-sm text-slate-400">Serveurs Surveillés</p>
            <p className="text-4xl font-extrabold mt-2 text-emerald-400">{activeMonitors}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <p className="text-sm text-slate-400">Latence Moyenne Globale</p>
            <p className="text-4xl font-extrabold mt-2 text-emerald-400">{avgResponse} ms</p>
          </div>
        </div>

        {/* TABLEAU DES CIBLES */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-lg font-semibold">Cibles Actives</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="p-4">Nom</th>
                  <th className="p-4">URL Cible</th>
                  <th className="p-4">Latence</th>
                  <th className="p-4">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm">
                {monitors.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      Aucune cible enregistrée pour le moment.
                    </td>
                  </tr>
                ) : (
                  monitors.map((mon) => (
                    <tr key={mon.id} className="hover:bg-slate-850">
                      <td className="p-4 font-medium">{mon.name}</td>
                      <td className="p-4 text-slate-400 font-mono text-xs">{mon.target_url}</td>
                      <td className="p-4">{mon.latency} ms</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                          mon.status === "online" 
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${mon.status === "online" ? "bg-emerald-400" : "bg-rose-400"}`}></span>
                          {mon.status === "online" ? "En ligne" : "Hors ligne"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
