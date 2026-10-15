import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import WashPattern from "@/components/WashPattern";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { allServices } from "@/data/services";
import { COMPANY } from "@/lib/company";
import { useServiceImageOverrides } from "@/hooks/useServiceImageOverrides";

const filters: { key: string; label: string; predicate: (s: typeof allServices[number]) => boolean }[] = [
  { key: "tous", label: "Tous", predicate: () => true },
  { key: "particulier", label: "Particulier", predicate: (s) => s.clientType === "Particulier" || s.clientType === "Tous" },
  { key: "professionnel", label: "Professionnel", predicate: (s) => s.clientType === "Professionnel" || s.clientType === "Tous" },
  { key: "auto", label: "Auto", predicate: (s) => s.category === "auto" },
];

const ServicesListPage = () => {
  const [filter, setFilter] = useState("tous");
  const getImage = useServiceImageOverrides();
  const active = filters.find((f) => f.key === filter)!;
  const filtered = allServices.filter(active.predicate);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="py-20 bg-primary">
        <div className="container text-center">
          <h1 className="text-4xl font-bold text-primary-foreground mb-4">Tous nos services</h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">{COMPANY.tagline} — {COMPANY.slogan}</p>
        </div>
      </section>

      <section className="py-20 bg-background relative">
        <WashPattern className="text-primary" />
        <div className="container relative">
          <div className="flex gap-2 justify-center mb-10 flex-wrap">
            {filters.map((t) => (
              <Button key={t.key} variant={filter === t.key ? "default" : "outline"} size="sm" onClick={() => setFilter(t.key)}>
                {t.label}
              </Button>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s, idx) => (
              <Link
                key={s.slug}
                to={`/services/${s.slug}`}
                className="group relative overflow-hidden rounded-2xl bg-neutral-900 text-white flex flex-col transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] ring-1 ring-white/5 hover:ring-primary/60"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={getImage(s.title, s.image)}
                    alt={s.title}
                    className="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=1200&q=70";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/20 to-transparent" />
                  <span className="absolute top-3 right-4 text-5xl font-extrabold text-white/90 drop-shadow-lg tracking-tight">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="absolute top-3 left-3 text-xs font-medium px-2 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white border border-white/20">{s.clientType}</span>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold mb-3 leading-tight line-clamp-2">{s.title}</h3>
                  <p className="text-sm text-white/60 line-clamp-2 flex-1">{s.short}</p>
                  <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary">{s.price}</span>
                    <span className="text-xs text-white/50 group-hover:text-white/80 transition-colors">Voir le service →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <a href={`tel:${COMPANY.phoneRaw}`}>
              <Button size="lg" variant="outline"><Phone className="h-4 w-4 mr-2" /> Nous appeler — {COMPANY.phone}</Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default ServicesListPage;
