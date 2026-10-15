export interface Pack {
  slug: string;
  name: string;
  badge: string;
  price: number;
  popular?: boolean;
  features: string[];
}

export const packs: Pack[] = [
  {
    slug: "piece",
    name: "Pack Pièce",
    badge: "Essentiel",
    price: 990,
    features: ["1 pièce jusqu'à 15 m² au sol", "Murs + plafond, 2 couches", "Protection & nettoyage inclus"],
  },
  {
    slug: "appartement",
    name: "Pack Appartement",
    badge: "Recommandé",
    price: 4900,
    popular: true,
    features: ["Appartement jusqu'à 80 m²", "Rebouchage et ponçage", "Peinture lessivable premium", "Choix de 3 couleurs"],
  },
  {
    slug: "villa",
    name: "Pack Villa",
    badge: "Premium",
    price: 12900,
    features: ["Villa intérieur complet", "Portes et boiseries laquées", "Conseil couleurs à domicile", "Équipe dédiée"],
  },
  {
    slug: "facade",
    name: "Pack Façade",
    badge: "Extérieur",
    price: 7900,
    features: ["Lavage haute pression", "Traitement fissures", "Peinture anti-UV 2 couches", "Échafaudage inclus"],
  },
  {
    slug: "deco-prestige",
    name: "Pack Déco Prestige",
    badge: "Artisanal",
    price: 2900,
    features: ["Mur d'accent en tadelakt ou stuc", "Jusqu'à 20 m²", "Finition cirée", "Garantie 5 ans"],
  },
];
