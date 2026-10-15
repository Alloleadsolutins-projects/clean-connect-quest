import { Paintbrush, Home, Palette, Layers, DoorOpen, ShieldCheck } from "lucide-react";
import heroPaint from "@/assets/hero-paint.jpg";
import paintExterior from "@/assets/paint-exterior.jpg";
import paintDeco from "@/assets/paint-deco.jpg";

export interface ServiceInfo {
  slug: string;
  title: string;
  short: string;
  description: string;
  price: string;
  duration: string;
  image: string;
  icon: any;
  category: string;
  clientType: "Particulier" | "Professionnel" | "Tous";
  features: string[];
}

export const allServices: ServiceInfo[] = [
  {
    slug: "peinture-interieure",
    title: "Peinture intérieure",
    short: "Murs et plafonds repeints avec soin, finitions nettes et sans traces.",
    description:
      "Peinture de salons, chambres, cuisines et bureaux : protection des meubles et sols, préparation des murs, sous-couche et deux couches de finition (mat, satiné ou velours).",
    price: "À partir de 35 DH / m²",
    duration: "1–5 jours",
    image: heroPaint,
    icon: Paintbrush,
    category: "interieur",
    clientType: "Tous",
    features: ["Protection des sols et meubles", "Rebouchage et ponçage", "Sous-couche adaptée", "2 couches de finition", "Nettoyage du chantier"],
  },
  {
    slug: "peinture-exterieure",
    title: "Peinture extérieure & façades",
    short: "Façades, murs de clôture et terrasses protégés contre le soleil et l'humidité.",
    description:
      "Ravalement et peinture de façades de villas, immeubles et murs de clôture avec peintures extérieures anti-UV et anti-humidité, adaptées au climat d'Agadir et Marrakech.",
    price: "À partir de 45 DH / m²",
    duration: "2–10 jours",
    image: paintExterior,
    icon: Home,
    category: "exterieur",
    clientType: "Tous",
    features: ["Lavage haute pression", "Traitement des fissures", "Peinture anti-UV", "Échafaudage sécurisé", "Garantie décennale façade"],
  },
  {
    slug: "decoration-tadelakt",
    title: "Décoration murale : tadelakt, stuc & effets",
    short: "Tadelakt, stuc vénitien, béton ciré et effets décoratifs sur mesure.",
    description:
      "Finitions décoratives artisanales : tadelakt marocain, stuc, béton ciré, effet chaux, patine et dégradés, réalisés par nos artisans.",
    price: "À partir de 150 DH / m²",
    duration: "Selon projet",
    image: paintDeco,
    icon: Palette,
    category: "decoration",
    clientType: "Tous",
    features: ["Tadelakt traditionnel", "Stuc vénitien", "Béton ciré", "Effets chaux & patine", "Conseil couleurs offert"],
  },
  {
    slug: "papier-peint-revetements",
    title: "Papier peint & revêtements muraux",
    short: "Pose de papier peint, toile de verre et panneaux décoratifs.",
    description:
      "Dépose de l'ancien revêtement, préparation des murs et pose soignée de papier peint, toile de verre, intissé ou panneaux 3D.",
    price: "À partir de 60 DH / m²",
    duration: "1–3 jours",
    image: "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1200&q=70",
    icon: Layers,
    category: "decoration",
    clientType: "Tous",
    features: ["Dépose ancien revêtement", "Préparation des murs", "Raccords parfaits", "Toile de verre & intissé", "Panneaux 3D"],
  },
  {
    slug: "boiseries-ferronnerie",
    title: "Portes, fenêtres, boiseries & ferronnerie",
    short: "Laquage de portes, volets, grilles et portails.",
    description:
      "Décapage, traitement antirouille et laquage de portes, fenêtres, volets, rampes, grilles et portails en bois ou en métal.",
    price: "À partir de 250 DH / pièce",
    duration: "1–3 jours",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=70",
    icon: DoorOpen,
    category: "boiseries",
    clientType: "Tous",
    features: ["Décapage & ponçage", "Traitement antirouille", "Laque glycéro ou acrylique", "Vernis bois", "Finition brillante ou satinée"],
  },
  {
    slug: "etancheite-traitement",
    title: "Étanchéité & traitement anti-humidité",
    short: "Terrasses, toitures et murs protégés contre les infiltrations.",
    description:
      "Traitement des murs humides, peinture d'étanchéité pour terrasses et toitures, résine et revêtements hydrofuges.",
    price: "À partir de 70 DH / m²",
    duration: "1–4 jours",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=70",
    icon: ShieldCheck,
    category: "exterieur",
    clientType: "Tous",
    features: ["Diagnostic humidité", "Traitement anti-moisissure", "Étanchéité terrasse", "Résine hydrofuge", "Garantie travaux"],
  },
];

export const findService = (slug?: string) => allServices.find((s) => s.slug === slug);
