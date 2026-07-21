import Link from "next/link";
import { Activity, Shield, Zap, Check } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto border-b border-white/5">
        <span className="text-xl font-semibold text-white">
          Sentinel Ops
        </span>
        <div className="flex gap-6 items-center">
          <Link 
            href="/dashboard" 
            className="text-sm bg-white text-black px-4 py-2 rounded-full font-medium"
          >
            Accéder au Dashboard
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-32 px-6 text-center max-w-4xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 mb-4">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Infrastructure v2.0 est en ligne
        </div>
        <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter">
          Surveillez tout.
          <br/>
          Sans effort.
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
          La plateforme de monitoring asynchrone conçue pour les architectures Cloud modernes.
        </p>
      </section>

      {/* Services Section */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <Activity className="w-8 h-8 text-emerald-500" />
            <h3 className="text-xl font-medium">Ping Asynchrone</h3>
            <p className="text-gray-400 font-light">
              Vérification de la latence à la milliseconde près, sans bloquer le thread principal.
            </p>
          </div>
          <div className="space-y-4">
            <Zap className="w-8 h-8 text-emerald-500" />
            <h3 className="text-xl font-medium">Temps Réel</h3>
            <p className="text-gray-400 font-light">
              Remontée des données en direct et affichage instantané sur des graphiques React.
            </p>
          </div>
          <div className="space-y-4">
            <Shield className="w-8 h-8 text-emerald-500" />
            <h3 className="text-xl font-medium">Sécurité Militaire</h3>
            <p className="text-gray-400 font-light">
              Authentification par jetons cryptographiques (JWT) et hachage asymétrique Bcrypt.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-semibold text-center mb-16">
          Un plan pour chaque infrastructure.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Tier */}
          <div className="border border-white/10 rounded-3xl p-8 bg-white/[0.01]">
            <h3 className="text-2xl font-medium mb-2">Hobby</h3>
            <p className="text-gray-400 text-sm mb-6">Pour les projets personnels.</p>
            <div className="text-4xl font-light mb-8">
              0€ <span className="text-lg text-gray-500">/mois</span>
            </div>
            <ul className="space-y-4 mb-8 text-gray-300">
              <li className="flex gap-3 items-center"><Check className="w-4 h-4 text-emerald-500"/> 3 Moniteurs</li>
              <li className="flex gap-3 items-center"><Check className="w-4 h-4 text-emerald-500"/> Ping 5 mins</li>
            </ul>
          </div>

          {/* Pro Tier */}
          <div className="border border-emerald-500/30 rounded-3xl p-8 bg-emerald-500/10 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-500 text-black text-xs font-bold rounded-full">POPULAIRE</div>
            <h3 className="text-2xl font-medium mb-2">Pro</h3>
            <p className="text-gray-400 text-sm mb-6">Pour les startups.</p>
            <div className="text-4xl font-light mb-8">
              19€ <span className="text-lg text-gray-500">/mois</span>
            </div>
            <ul className="space-y-4 mb-8 text-gray-300">
              <li className="flex gap-3 items-center"><Check className="w-4 h-4 text-emerald-500"/> 50 Moniteurs</li>
              <li className="flex gap-3 items-center"><Check className="w-4 h-4 text-emerald-500"/> Alertes Webhook</li>
            </ul>
          </div>

          {/* Enterprise Tier */}
          <div className="border border-white/10 rounded-3xl p-8 bg-white/[0.01]">
            <h3 className="text-2xl font-medium mb-2">Enterprise</h3>
            <p className="text-gray-400 text-sm mb-6">Pour le critique.</p>
            <div className="text-4xl font-light mb-8">Sur mesure</div>
            <ul className="space-y-4 mb-8 text-gray-300">
              <li className="flex gap-3 items-center"><Check className="w-4 h-4 text-emerald-500"/> Illimité</li>
              <li className="flex gap-3 items-center"><Check className="w-4 h-4 text-emerald-500"/> Support 24/7</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
