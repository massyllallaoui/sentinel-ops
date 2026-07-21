"use client";

import { useEffect, useState } from "react";
import { Activity, Server, ShieldCheck, Zap, RefreshCw } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const [data, setData] = useState({ active_monitors: 0, avg_response: 0, chart_data: [] });
  const [loading, setLoading] = useState(true);

  // Le VRAI Token JWT nettoyé
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

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="p-8 md:p-16 max-w-7xl mx-auto space-y-12">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
            Sentinel Ops
          </h1>
          <p className="text-gray-400 mt-2 font-medium">Surveillance globale des infrastructures</p>
        </div>
        <div className="flex items-center gap-3 glass-card px-4 py-2 cursor-pointer" onClick={fetchDashboardData}>
          {loading ? (
            <RefreshCw className="w-4 h-4 text-gray-400 animate-spin" />
          ) : (
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          )}
          <span className="text-sm text-gray-300 font-medium">Temps réel</span>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex flex-col gap-4 transition-transform hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 font-medium">Serveurs Surveillés</span>
            <Server className="text-gray-500 w-5 h-5" />
          </div>
          <span className="text-3xl font-light tracking-tight">{data.active_monitors}</span>
        </div>
        
        <div className="glass-card p-6 flex flex-col gap-4 transition-transform hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 font-medium">Latence Moyenne</span>
            <Zap className="text-emerald-500 w-5 h-5" />
          </div>
          <span className="text-3xl font-light tracking-tight">{data.avg_response}<span className="text-lg text-gray-500 ml-1">ms</span></span>
        </div>

        <div className="glass-card p-6 flex flex-col gap-4 transition-transform hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 font-medium">Chiffrement</span>
            <ShieldCheck className="text-emerald-500 w-5 h-5" />
          </div>
          <span className="text-3xl font-light tracking-tight text-emerald-400">JWT Sécurisé</span>
        </div>
      </section>

      <section className="glass-card p-6 md:p-8">
        <div className="flex items-center gap-3 mb-8">
          <Activity className="text-gray-400 w-5 h-5" />
          <h2 className="text-xl font-medium text-gray-200">Activité Réseau (Derniers Pings)</h2>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.chart_data}>
              <defs>
                <linearGradient id="colorMs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}ms`} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}
                itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
              />
              <Area 
                type="monotone" 
                dataKey="ms" 
                stroke="#10b981" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorMs)" 
                activeDot={{ r: 6, fill: '#000', stroke: '#10b981', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
    </main>
  );
}
