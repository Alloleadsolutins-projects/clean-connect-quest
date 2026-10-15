import { Link } from "react-router-dom";
import { ArrowRight, Star, CheckCircle2, Phone, Palette, Ruler, CalendarCheck, Paintbrush, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import heroImage from "@/assets/hero-paint.jpg";
import paintDeco from "@/assets/paint-deco.jpg";
import paintExterior from "@/assets/paint-exterior.jpg";
import { allServices } from "@/data/services";
import { packs } from "@/data/packs";
import { COMPANY, whatsappLink } from "@/lib/company";
import { useServiceImageOverrides } from "@/hooks/useServiceImageOverrides";

const swatches = [
  { name: "Terracotta", cls: "bg-primary" },
  { name: "Ocre", cls: "bg-warning" },
  { name: "Pétrole", cls: "bg-secondary" },
  { name: "Sauge", cls: "bg-success" },
  { name: "Sable", cls: "bg-muted" },
];

const Index = () => {
  const getImage = useServiceImageOverrides();

  const steps = [
    { icon: Palette, title: "Choisissez", desc: "Le service et la finition souhaités" },
    { icon: Ruler, title: "Photos & métrage", desc: "Envoyez les photos et la surface" },
    { icon: CalendarCheck, title: "Devis & date", desc: "Devis précis puis planification" },
    { icon: Paintbrush, title: "On peint", desc: "Chantier propre, livré à l'heure" },
  ];

  const reviews = [
    { name: "Youssef El Amrani", text: "Appartement entièrement repeint en 4 jours, finitions parfaites et chantier laissé propre." },
    { name: "Fatima Zahra Bennani", text: "Le tadelakt de notre salle de bain est magnifique. De vrais artisans, je recommande Peintyhome." },
    { name: "Rachid Bouazza", text: "Façade de la villa refaite avant l'été, très bon conseil sur les couleurs." },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero : split layout */}
      <section className="bg-background">
        <div className="container grid lg:grid-cols-2 gap-10 items-center py-12 md:py-20">
          <div>
            <div className="flex gap-1.5 mb-6">
              {swatches.map((s) => <span key={s.name} className={`h-3 w-10 rounded-full ${s.cls}`} />)}
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-[1.05] mb-5">
              Donnez de la <span className="text-primary">couleur</span> à votre maison
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mb-8">
              {COMPANY.name} — {COMPANY.tagline.toLowerCase()} à Agadir et Marrakech. Peinture intérieure, façades, tadelakt et décoration murale par des artisans peintres.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/services"><Button size="lg" className="px-8">Demander un devis <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
              <a href={`tel:${COMPANY.phoneRaw}`}><Button size="lg" variant="outline"><Phone className="mr-2 h-4 w-4" /> {COMPANY.phone}</Button></a>
            </div>
            <div className="flex gap-8 mt-10">
              {[["800+", "Chantiers"], ["4.9/5", "Avis clients"], ["5 ans", "Garantie"]].map(([v, l]) => (
                <div key={l}><div className="font-display text-2xl font-bold">{v}</div><div className="text-xs text-muted-foreground">{l}</div></div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img src={heroImage} alt="Peintre Peintyhome en train de peindre un salon" className="w-full h-[420px] md:h-[520px] object-cover rounded-[2rem] rounded-tr-[6rem]" width={1600} height={912} />
            <div className="absolute -bottom-6 -left-4 md:left-[-2rem] bg-card border rounded-2xl p-4 shadow-lg flex items-center gap-3">
              <ShieldCheck className="h-8 w-8 text-success" />
              <div><div className="font-semibold text-sm">Peintures certifiées</div><div className="text-xs text-muted-foreground">Sans odeur · lessivables</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services : liste éditoriale */}
      <section id="services" className="py-20 bg-muted">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Nos séries de peinture</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold">Un savoir-faire pour chaque surface</h2>
            </div>
            <Link to="/services"><Button variant="outline">Tous les services <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {allServices.map((s) => (
              <Link key={s.slug} to={`/services/${s.slug}`} className="group bg-card rounded-3xl overflow-hidden border hover:border-primary transition-colors flex flex-col">
                <div className="overflow-hidden">
                  <img src={getImage(s.title, s.image)} alt={s.title} loading="lazy" className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center mb-3">
                    <s.icon className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground flex-1">{s.short}</p>
                  <div className="mt-4 pt-4 border-t flex justify-between items-center text-sm">
                    <span className="font-semibold text-primary">{s.price}</span>
                    <span className="text-muted-foreground group-hover:text-foreground">Découvrir →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Étapes */}
      <section className="py-20 bg-secondary text-secondary-foreground">
        <div className="container">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-12 text-center">Votre projet en 4 étapes</h2>
          <div className="grid gap-6 md:grid-cols-4">
            {steps.map((st, i) => (
              <div key={i} className="rounded-3xl border border-secondary-foreground/15 p-6">
                <div className="flex items-center justify-between mb-6">
                  <st.icon className="h-8 w-8 text-warning" />
                  <span className="font-display text-4xl font-bold text-secondary-foreground/20">0{i + 1}</span>
                </div>
                <h3 className="font-semibold text-lg mb-1">{st.title}</h3>
                <p className="text-sm text-secondary-foreground/70">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packs */}
      <section id="packs" className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Packs peinture</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold">Des formules claires, tout compris</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {packs.slice(0, 3).map((pack) => (
              <div key={pack.slug} className={`rounded-3xl p-7 border flex flex-col ${pack.popular ? "bg-primary text-primary-foreground border-primary" : "bg-card"}`}>
                <span className={`text-xs font-semibold uppercase tracking-wider ${pack.popular ? "text-primary-foreground/80" : "text-primary"}`}>{pack.badge}</span>
                <h3 className="font-display text-2xl font-bold mt-1 mb-4">{pack.name}</h3>
                <div className="mb-6">
                  <span className="block text-xs opacity-70">À partir de</span>
                  <span className="text-4xl font-bold">{pack.price} <span className="text-base font-normal opacity-70">DH</span></span>
                </div>
                <ul className="space-y-2 mb-8 flex-1">
                  {pack.features.map((f, j) => (
                    <li key={j} className="flex gap-2 text-sm"><CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" /> {f}</li>
                  ))}
                </ul>
                <Link to="/packs"><Button className="w-full" variant={pack.popular ? "secondary" : "default"}>Choisir ce pack</Button></Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Réalisations */}
      <section className="py-20 bg-muted">
        <div className="container grid md:grid-cols-5 gap-6">
          <img src={paintDeco} alt="Finition tadelakt ocre" loading="lazy" className="md:col-span-3 w-full h-80 object-cover rounded-3xl" />
          <img src={paintExterior} alt="Peinture de façade de villa" loading="lazy" className="md:col-span-2 w-full h-80 object-cover rounded-3xl" />
          <div className="md:col-span-5 grid md:grid-cols-3 gap-6 mt-4">
            {[
              { icon: Sparkles, t: "Finitions d'artisan", d: "Tadelakt, stuc et effets réalisés à la main." },
              { icon: ShieldCheck, t: "Chantier protégé", d: "Bâches, adhésifs et nettoyage complet." },
              { icon: Palette, t: "Conseil couleurs", d: "Nuanciers et échantillons sur place." },
            ].map((x) => (
              <div key={x.t} className="flex gap-4">
                <x.icon className="h-6 w-6 text-primary flex-shrink-0" />
                <div><h3 className="font-semibold">{x.t}</h3><p className="text-sm text-muted-foreground">{x.d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Avis */}
      <section id="reviews" className="py-20 bg-background">
        <div className="container">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">Ils ont choisi Peintyhome</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {reviews.map((r, i) => (
              <div key={i} className="rounded-3xl bg-card border p-6">
                <div className="flex gap-1 mb-3">{Array.from({ length: 5 }).map((_, j) => <Star key={j} className="h-4 w-4 fill-warning text-warning" />)}</div>
                <p className="text-sm text-muted-foreground mb-4">"{r.text}"</p>
                <p className="font-semibold text-sm">{r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="container text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">Un mur, une pièce, une villa ?</h2>
          <p className="text-primary-foreground/80 mb-8">Devis gratuit après envoi de photos sur WhatsApp.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href={whatsappLink()} target="_blank" rel="noreferrer"><Button size="lg" variant="secondary">Devis WhatsApp</Button></a>
            <a href={`tel:${COMPANY.phoneRaw}`}><Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground/40 hover:bg-primary-foreground/10"><Phone className="mr-2 h-4 w-4" />{COMPANY.phone}</Button></a>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
