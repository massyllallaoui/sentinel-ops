import Link from "next/link";
import { Activity, Shield, Zap, ChevronRight, Check } from "lucide-react";

export default function LandingPage() {
  return (
    
      {/* Navigation Ultra Minimaliste */}
      
        Sentinel Ops
        
          Connexion
          
            Accéder au Dashboard
          
        
      

      {/* Hero Section */}
      
        
          
          Infrastructure v2.0 est en ligne
        
        
          Surveillez tout.Sans effort.
        
        
          La plateforme de monitoring asynchrone conçue pour les architectures Cloud modernes. Détectez les pannes avant vos clients.
        
      

      {/* Services Section */}
      
        
          
            
            Ping Asynchrone
            Vérification de la latence à la milliseconde près, sans bloquer le thread principal grâce à notre Worker isolé.
          
          
            
            Temps Réel
            Remontée des données en direct via l'API FastAPI et affichage instantané sur des graphiques React.
          
          
            
            Sécurité Militaire
            Authentification par jetons cryptographiques (JWT) et hachage asymétrique Bcrypt des données sensibles.
          
        
      

      {/* Pricing Section */}
      
        Un plan pour chaque infrastructure.
        
          {/* Free Tier */}
          
            Hobby
            Pour les projets personnels.
            0€ /mois
            
               3 Moniteurs
               Ping toutes les 5 mins
               Historique 24h
            
            Commencer
          

          {/* Pro Tier */}
          
            POPULAIRE
            Pro
            Pour les startups et freelances.
            19€ /mois
            
               50 Moniteurs
               Ping chaque minute
               Historique 30 jours
               Alertes Webhook
            
            Essai gratuit 14 jours
          

          {/* Enterprise Tier */}
          
            Enterprise
            Pour les architectures critiques.
            Sur mesure
            
               Moniteurs illimités
               Ping par seconde
               Historique illimité
               Support dédié 24/7
            
            Contacter les ventes
          
        
      
    
  );
}
