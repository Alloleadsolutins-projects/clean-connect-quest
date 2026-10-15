import { Link } from "react-router-dom";
import { Phone, Mail, Globe, Instagram, Facebook, MapPin } from "lucide-react";
import logo from "/cleango-logo.png";
import { COMPANY } from "@/lib/company";
import { allServices } from "@/data/services";

const Footer = () => (
  <footer className="bg-card py-12">
    <div className="container grid gap-8 md:grid-cols-4">
      <div>
        <img src={logo} alt="Peintyhome" className="h-14 w-auto mb-3" />
        <p className="text-sm text-muted-foreground mb-2">{COMPANY.tagline}</p>
        <p className="text-xs font-medium text-primary">{COMPANY.slogan}</p>
      </div>
      <div>
        <h4 className="font-semibold mb-3 text-sm">Services</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {allServices.slice(0, 6).map((s) => (
            <li key={s.slug}>
              <Link to={`/services/${s.slug}`} className="hover:text-foreground transition-colors line-clamp-1">
                {s.title.split(" ").slice(0, 4).join(" ")}…
              </Link>
            </li>
          ))}
          <li><Link to="/services" className="hover:text-foreground transition-colors font-medium">Voir tous les services →</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-3 text-sm">Entreprise</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/about" className="hover:text-foreground transition-colors">À propos</Link></li>
          <li><Link to="/packs" className="hover:text-foreground transition-colors">Packs Detailing</Link></li>
          <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
          <li><Link to="/terms" className="hover:text-foreground transition-colors">Conditions générales</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-3 text-sm">Contact</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /><a href={`tel:${COMPANY.phoneRaw}`} className="hover:text-foreground">{COMPANY.phone}</a></li>
          <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /><a href={`mailto:${COMPANY.email}`} className="hover:text-foreground">{COMPANY.email}</a></li>
          <li className="flex items-center gap-2"><Globe className="h-4 w-4 text-primary" />{COMPANY.website}</li>
          <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{COMPANY.address}</li>
          <li className="flex items-center gap-3 pt-1">
            <a href="#" className="hover:text-primary"><Instagram className="h-5 w-5" /></a>
            <a href="#" className="hover:text-primary"><Facebook className="h-5 w-5" /></a>
          </li>
        </ul>
      </div>
    </div>
    <div className="container mt-8 pt-8 border-t">
      <p className="text-xs text-muted-foreground text-center">© 2026 Peintyhome. Tous droits réservés.</p>
    </div>
  </footer>
);

export default Footer;
