// Wizard configuration per service slug.
// Each config drives the PropertyBookingWizard (steps: type -> criterion -> formule -> reservation).

export interface WizardOption {
  id: string;
  label: string;
  emoji?: string;
  iconKey?: "sedari" | "bigSuv";
  multiplier?: number;
}

export interface WizardFormule {
  slug: string;
  name: string;
  badge?: string;
  price: number;
  popular?: boolean;
  features: string[];
}

export interface ServiceWizardConfig {
  goodLabel: string; // "bien" label (Canapé, Tapis, Piscine, Surface…)
  step1: {
    title: string;
    options: WizardOption[];
  };
  step2: {
    title: string;
    options: WizardOption[];
  };
  formules: WizardFormule[];
}

export const serviceWizards: Record<string, ServiceWizardConfig> = {
  "peinture-interieure": {
    goodLabel: "Surface",
    step1: {
      title: "Que faut-il peindre ?",
      options: [
        { id: "mur", label: "Murs", emoji: "🧱", multiplier: 1 },
        { id: "plafond", label: "Plafond", emoji: "⬜", multiplier: 1.2 },
        { id: "chambre", label: "Chambre complète", emoji: "🛏️", multiplier: 1.5 },
        { id: "salon", label: "Salon complet", emoji: "🛋️", multiplier: 1.8 },
        { id: "cuisine-sdb", label: "Cuisine / salle de bain", emoji: "🚿", multiplier: 1.3 },
      ],
    },
    step2: {
      title: "Quelle finition ?",
      options: [
        { id: "mat", label: "Mat", emoji: "🎨", multiplier: 1 },
        { id: "satine", label: "Satiné", emoji: "✨", multiplier: 1.15 },
        { id: "velours", label: "Velours", emoji: "🖌️", multiplier: 1.3 },
        { id: "brillant", label: "Brillant / laqué", emoji: "💎", multiplier: 1.4 },
      ],
    },
    formules: [
      { slug: "simple", name: "Rafraîchissement", badge: "Rapide", price: 35, features: ["1 couche de finition", "Protection sols", "Nettoyage"] },
      { slug: "complet", name: "Rénovation complète", badge: "Recommandé", price: 55, popular: true, features: ["Rebouchage & ponçage", "Sous-couche", "2 couches finition"] },
      { slug: "premium", name: "Finition Premium", badge: "Haut de gamme", price: 85, features: ["Enduit de lissage", "Peinture premium", "2 couches + retouches", "Garantie 5 ans"] },
    ],
  },
  "peinture-exterieure": {
    goodLabel: "Surface",
    step1: {
      title: "Quelle surface extérieure ?",
      options: [
        { id: "facade", label: "Façade", emoji: "🏠", multiplier: 1 },
        { id: "cloture", label: "Mur de clôture", emoji: "🧱", multiplier: 0.8 },
        { id: "terrasse", label: "Terrasse / balcon", emoji: "🌴", multiplier: 0.9 },
        { id: "immeuble", label: "Immeuble", emoji: "🏢", multiplier: 1.4 },
      ],
    },
    step2: {
      title: "Quel état actuel ?",
      options: [
        { id: "bon", label: "Bon état", emoji: "🙂", multiplier: 1 },
        { id: "fissures", label: "Quelques fissures", emoji: "⚠️", multiplier: 1.2 },
        { id: "degrade", label: "Très dégradé", emoji: "🔨", multiplier: 1.5 },
      ],
    },
    formules: [
      { slug: "standard", name: "Façade standard", badge: "Essentiel", price: 45, features: ["Lavage haute pression", "2 couches acryliques"] },
      { slug: "protection", name: "Protection climat", badge: "Recommandé", price: 65, popular: true, features: ["Traitement fissures", "Peinture anti-UV", "Hydrofuge"] },
      { slug: "renovation", name: "Ravalement complet", badge: "Premium", price: 95, features: ["Enduit de façade", "Peinture siloxane", "Échafaudage inclus", "Garantie 10 ans"] },
    ],
  },
  "decoration-tadelakt": {
    goodLabel: "Mur décoratif",
    step1: {
      title: "Quel effet décoratif ?",
      options: [
        { id: "tadelakt", label: "Tadelakt marocain", emoji: "🏺", multiplier: 1.3 },
        { id: "stuc", label: "Stuc vénitien", emoji: "✨", multiplier: 1.2 },
        { id: "beton-cire", label: "Béton ciré", emoji: "🪨", multiplier: 1 },
        { id: "chaux", label: "Effet chaux / patine", emoji: "🎨", multiplier: 0.8 },
      ],
    },
    step2: {
      title: "Quelle pièce ?",
      options: [
        { id: "salon", label: "Salon", emoji: "🛋️", multiplier: 1 },
        { id: "sdb", label: "Salle de bain / hammam", emoji: "🚿", multiplier: 1.3 },
        { id: "entree", label: "Entrée / couloir", emoji: "🚪", multiplier: 0.9 },
        { id: "exterieur", label: "Extérieur", emoji: "🌴", multiplier: 1.2 },
      ],
    },
    formules: [
      { slug: "accent", name: "Mur d'accent", badge: "Déco", price: 150, features: ["1 mur", "Teinte au choix"] },
      { slug: "piece", name: "Pièce complète", badge: "Recommandé", price: 220, popular: true, features: ["Tous les murs", "Échantillon préalable", "Finition cirée"] },
      { slug: "signature", name: "Création signature", badge: "Artisanal", price: 350, features: ["Motifs sur mesure", "Pigments naturels", "Garantie 5 ans"] },
    ],
  },
  "papier-peint-revetements": {
    goodLabel: "Surface",
    step1: {
      title: "Quel revêtement ?",
      options: [
        { id: "papier-peint", label: "Papier peint", emoji: "🖼️", multiplier: 1 },
        { id: "intisse", label: "Intissé", emoji: "📜", multiplier: 1.1 },
        { id: "toile-verre", label: "Toile de verre", emoji: "🔲", multiplier: 1.2 },
        { id: "panneaux", label: "Panneaux 3D", emoji: "🧩", multiplier: 1.6 },
      ],
    },
    step2: {
      title: "Dépose de l'ancien revêtement ?",
      options: [
        { id: "non", label: "Non, mur nu", emoji: "✅", multiplier: 1 },
        { id: "oui", label: "Oui, à déposer", emoji: "🧽", multiplier: 1.3 },
      ],
    },
    formules: [
      { slug: "pose", name: "Pose simple", badge: "Essentiel", price: 60, features: ["Pose soignée", "Raccords"] },
      { slug: "complet", name: "Pose + préparation", badge: "Recommandé", price: 90, popular: true, features: ["Préparation des murs", "Pose", "Finitions"] },
      { slug: "premium", name: "Mur décor premium", badge: "Haut de gamme", price: 150, features: ["Revêtement fourni", "Conseil déco", "Pose experte"] },
    ],
  },
  "boiseries-ferronnerie": {
    goodLabel: "Élément",
    step1: {
      title: "Quel élément à peindre ?",
      options: [
        { id: "porte", label: "Porte", emoji: "🚪", multiplier: 1 },
        { id: "fenetre", label: "Fenêtre / volet", emoji: "🪟", multiplier: 0.8 },
        { id: "grille", label: "Grille / rampe", emoji: "⛓️", multiplier: 0.9 },
        { id: "portail", label: "Portail", emoji: "🏰", multiplier: 2 },
      ],
    },
    step2: {
      title: "Quel matériau ?",
      options: [
        { id: "bois", label: "Bois", emoji: "🪵", multiplier: 1 },
        { id: "metal", label: "Métal", emoji: "🔩", multiplier: 1.2 },
        { id: "pvc", label: "PVC / alu", emoji: "⬜", multiplier: 0.9 },
      ],
    },
    formules: [
      { slug: "rafraichir", name: "Rafraîchissement", badge: "Simple", price: 250, features: ["Ponçage léger", "1 couche laque"] },
      { slug: "complet", name: "Laquage complet", badge: "Recommandé", price: 450, popular: true, features: ["Décapage", "Antirouille / apprêt", "2 couches laque"] },
      { slug: "prestige", name: "Finition prestige", badge: "Premium", price: 750, features: ["Décapage total", "Laque haut de gamme", "Vernis protecteur"] },
    ],
  },
  "etancheite-traitement": {
    goodLabel: "Surface",
    step1: {
      title: "Quelle zone à traiter ?",
      options: [
        { id: "terrasse", label: "Terrasse / toiture", emoji: "🏠", multiplier: 1 },
        { id: "mur-humide", label: "Mur humide", emoji: "💧", multiplier: 0.9 },
        { id: "sdb", label: "Salle de bain", emoji: "🚿", multiplier: 1.1 },
        { id: "piscine", label: "Bassin / piscine", emoji: "🏊", multiplier: 1.5 },
      ],
    },
    step2: {
      title: "Gravité du problème ?",
      options: [
        { id: "preventif", label: "Préventif", emoji: "🛡️", multiplier: 1 },
        { id: "traces", label: "Traces d'humidité", emoji: "⚠️", multiplier: 1.2 },
        { id: "infiltration", label: "Infiltrations", emoji: "🌧️", multiplier: 1.5 },
      ],
    },
    formules: [
      { slug: "traitement", name: "Traitement simple", badge: "Essentiel", price: 70, features: ["Anti-moisissure", "Peinture hydrofuge"] },
      { slug: "etancheite", name: "Étanchéité complète", badge: "Recommandé", price: 120, popular: true, features: ["Diagnostic", "Résine d'étanchéité", "2 couches"] },
      { slug: "garantie", name: "Solution garantie", badge: "Premium", price: 180, features: ["Membrane armée", "Finition circulable", "Garantie 10 ans"] },
    ],
  },
};

export const hasWizard = (slug?: string) => !!slug && slug !== "detailing-automobile" && !!serviceWizards[slug];
