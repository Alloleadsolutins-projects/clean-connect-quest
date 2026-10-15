export const COMPANY = {
  name: "Peintyhome",
  tagline: "Société spécialisée en peinture et décoration",
  slogan: "Couleur · Finition · Confiance",
  phone: "+212 6 60 60 25 06",
  phoneRaw: "+212660602506",
  email: "contact@peintyhome.ma",
  website: "www.peintyhome.ma",
  instagram: "peintyhome.ma",
  facebook: "peintyhome.ma",
  address: "Agadir, Maroc",
  hours: "Lun - Sam : 8h - 20h",
};

export const CITIES = ["Agadir", "Marrakech"];

export const whatsappLink = (message = "Bonjour Peintyhome, je souhaite un devis peinture.") =>
  `https://wa.me/${COMPANY.phoneRaw.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
